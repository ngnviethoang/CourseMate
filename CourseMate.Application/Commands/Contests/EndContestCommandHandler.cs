using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Contests;

public class EndContestCommand : IRequest<ResultIdDto>
{
    public Guid ContestId { get; set; }
}

public sealed class EndContestCommandHandler : AbstractCommandHandler<EndContestCommand, ResultIdDto>
{
    public EndContestCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(EndContestCommand request, CancellationToken ct)
    {
        Contest? contest = await DbContext.Contests.FindAsync([request.ContestId], ct);
        if (contest == null)
        {
            throw new BusinessException(ErrorCode.Unknown, "Contest not found.");
        }

        bool isAdmin = IsInRole(Roles.Admin);
        if (!isAdmin && contest.CreatorId != CurrentUserId)
        {
            throw new UnauthorizedAccessException("You are not allowed to end this contest.");
        }

        if (contest.Status == ContestStatus.Ended)
        {
            return new ResultIdDto { Id = contest.Id };
        }

        contest.Status = ContestStatus.Ended;

        // ── Award prizes ──────────────────────────────────────────────────────
        List<ContestPrize> prizes = await DbContext.ContestPrizes
            .Where(p => p.ContestId == request.ContestId)
            .ToListAsync(ct);

        if (prizes.Count > 0)
        {
            // Build leaderboard: best score per student per exercise
            List<ContestSubmission> allSubmissions = await DbContext.ContestSubmissions
                .Where(s => s.ContestId == request.ContestId)
                .ToListAsync(ct);

            // Group by student, pick best score per exercise, sum totals
            List<(Guid StudentId, int TotalScore, float TotalRuntime, DateTimeOffset LastSubmit)> leaderboard = allSubmissions
                .GroupBy(s => s.StudentId)
                .Select(studentGroup =>
                {
                    List<ContestSubmission> bestPerExercise = studentGroup
                        .GroupBy(s => s.ExerciseId)
                        .Select(eg => eg.OrderByDescending(s => s.Score).ThenBy(s => s.TotalTime).First())
                        .ToList();

                    return (
                        StudentId: studentGroup.Key,
                        TotalScore: bestPerExercise.Sum(s => s.Score),
                        TotalRuntime: bestPerExercise.Sum(s => s.TotalTime),
                        LastSubmit: bestPerExercise.Max(s => s.CreationTime)
                    );
                })
                .OrderByDescending(e => e.TotalScore)
                .ThenBy(e => e.TotalRuntime)
                .ThenBy(e => e.LastSubmit)
                .ToList();

            // Assign 1-based ranks
            Dictionary<int, Guid> rankToStudent = new();
            for (int i = 0; i < leaderboard.Count; i++)
            {
                rankToStudent[i + 1] = leaderboard[i].StudentId;
            }

            // Award each prize
            foreach (ContestPrize prize in prizes)
            {
                for (int currentRank = prize.MinRank; currentRank <= prize.MaxRank; currentRank++)
                {
                    if (!rankToStudent.TryGetValue(currentRank, out Guid winnerId))
                    {
                        // No student achieved this rank (fewer participants than ranks)
                        continue;
                    }

                    // Skip if already enrolled
                    bool alreadyEnrolled = await DbContext.Enrollments
                        .AnyAsync(e => e.StudentId == winnerId && e.CourseId == prize.CourseId, ct);

                    if (alreadyEnrolled)
                    {
                        continue;
                    }

                    // Create a free order
                    Order order = new(
                        Guid.NewGuid(),
                        winnerId,
                        0m,
                        OrderStatus.Completed,
                        $"Giải thưởng cuộc thi: Hạng {currentRank}"
                    );
                    await DbContext.Orders.AddAsync(order, ct);

                    // Create order item
                    OrderItem orderItem = new(Guid.NewGuid(), order.Id, prize.CourseId, 0m);
                    await DbContext.OrderItems.AddAsync(orderItem, ct);

                    // Create enrollment
                    Enrollment enrollment = new(Guid.NewGuid(), winnerId, prize.CourseId);
                    await DbContext.Enrollments.AddAsync(enrollment, ct);
                }
            }
        }

        await DbContext.SaveChangesAsync(ct);

        return new ResultIdDto { Id = contest.Id };
    }
}
