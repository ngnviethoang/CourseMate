using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Contests;

public class GetContestByIdQuery : IRequest<ContestDto?>
{
    public Guid Id { get; set; }
}

internal sealed class GetContestByIdQueryHandler : AbstractQueryHandler<GetContestByIdQuery, ContestDto?>
{
    public GetContestByIdQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ContestDto?> Handle(GetContestByIdQuery request, CancellationToken ct)
    {
        ContestDto? result = await (
            from contest in DbContext.Contests
            join user in DbContext.Users on contest.CreatorId equals user.Id
            where contest.Id == request.Id
            select new ContestDto
            {
                Id = contest.Id,
                Title = contest.Title,
                Description = contest.Description,
                Status = contest.Status,
                StartTime = contest.StartTime,
                EndTime = contest.EndTime,
                DurationInMinutes = contest.DurationInMinutes,
                AllowedLanguages = contest.AllowedLanguages,
                MemoryLimit = contest.MemoryLimit,
                TimeLimit = contest.TimeLimit,
                AntiCheatLevel = contest.AntiCheatLevel,
                CreatorId = contest.CreatorId,
                CreatorName = user.UserName,
                CreationTime = contest.CreationTime,
                ExerciseCount = DbContext.ContestExercises.Count(x => x.ContestId == contest.Id),
                ParticipantCount = DbContext.ContestRegistrations.Count(x => x.ContestId == contest.Id),
                IsRegistered = DbContext.ContestRegistrations.Any(x => x.ContestId == contest.Id && x.StudentId == CurrentUserId)
            }).FirstOrDefaultAsync(ct);

        if (result != null)
        {
            var exercises = await (
                from ce in DbContext.ContestExercises
                join e in DbContext.Exercises on ce.ExerciseId equals e.Id
                where ce.ContestId == result.Id
                orderby ce.Order
                select new ContestExerciseDto
                {
                    Id = ce.Id,
                    ExerciseId = e.Id,
                    Title = e.Title,
                    Description = e.Description,
                    ScoreWeight = ce.ScoreWeight,
                    Order = ce.Order,
                    IsPassed = DbContext.ContestSubmissions.Any(s => s.ContestId == ce.ContestId && s.ExerciseId == e.Id && s.StudentId == CurrentUserId && s.Score == 100),
                    Constraints = e.Constraints.ToList(),
                    Hints = e.Hints.ToList()
                }).ToListAsync(ct);

            bool shouldMask = IsInRole(Roles.Student) && 
                             (result.Status == ContestStatus.Upcoming || 
                              result.Status == ContestStatus.Draft);

            if (shouldMask)
            {
                foreach (var ex in exercises)
                {
                    ex.Title = $"Problem {GetProblemLabel(ex.Order)}";
                    ex.Description = "Nội dung bài tập sẽ được hiển thị khi cuộc thi bắt đầu.";
                    ex.Constraints = [];
                    ex.Hints = [];
                    ex.Examples = [];
                    ex.DefaultCodes = [];
                }
            }
            else
            {
                foreach (var ex in exercises)
                {
                    ex.Examples = await DbContext.ExerciseExamples
                        .Where(x => x.ExerciseId == ex.ExerciseId)
                        .Select(x => new ExerciseExampleDto
                        {
                            Id = x.Id,
                            Input = x.Input,
                            Output = x.Output,
                            Explanation = x.Explanation
                        }).ToListAsync(ct);

                    ex.DefaultCodes = await DbContext.ExerciseDefaultCodes
                        .Where(x => x.ExerciseId == ex.ExerciseId)
                        .Select(x => new ExerciseDefaultCodeDto
                        {
                            Id = x.Id,
                            Language = x.Language,
                            StarterCode = x.StarterCode
                        }).ToListAsync(ct);
                }
            }

            result.Exercises = exercises;
        }

        return result;
    }

    private string GetProblemLabel(int order)
    {
        return ((char)('A' + (order - 1))).ToString();
    }
}
