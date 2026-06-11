using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Contests;

public class AddContestPrizeCommand : IRequest<ResultIdDto>
{
    public Guid ContestId { get; set; }
    public int MinRank { get; set; }
    public int MaxRank { get; set; }
    public Guid CourseId { get; set; }
}

public sealed class AddContestPrizeCommandHandler : AbstractCommandHandler<AddContestPrizeCommand, ResultIdDto>
{
    public AddContestPrizeCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(AddContestPrizeCommand request, CancellationToken ct)
    {
        Contest? contest = await DbContext.Contests.FindAsync([request.ContestId], ct);
        if (contest == null)
        {
            throw new BusinessException(ErrorCode.Unknown, "Contest not found.");
        }

        // Only the creator or admin can manage prizes
        bool isAdmin = IsInRole(Roles.Admin);
        if (!isAdmin && contest.CreatorId != CurrentUserId)
        {
            throw new UnauthorizedAccessException("You are not allowed to manage prizes for this contest.");
        }

        // Validate rank
        if (request.MinRank < 1)
        {
            throw new BusinessException(ErrorCode.Unknown, "MinRank must be at least 1.");
        }
        if (request.MaxRank < request.MinRank)
        {
            throw new BusinessException(ErrorCode.Unknown, "MaxRank cannot be smaller than MinRank.");
        }

        // Verify the course exists
        Course? course = await DbContext.Courses.FindAsync([request.CourseId], ct);
        if (course == null)
        {
            throw new BusinessException(ErrorCode.Unknown, "Course not found.");
        }

        // Instructor can only use their own courses
        if (!isAdmin && course.InstructorId != CurrentUserId)
        {
            throw new BusinessException(ErrorCode.Unknown, "Instructors can only award their own courses as prizes.");
        }

        // Check for overlaps with existing prizes
        bool hasOverlap = await DbContext.ContestPrizes
            .AnyAsync(x => x.ContestId == request.ContestId &&
                           x.MinRank <= request.MaxRank && x.MaxRank >= request.MinRank, ct);

        if (hasOverlap)
        {
            // If we just want to update an exact match, we should do that before overlap check, 
            // but let's just delete the exact match or throw overlap error
            ContestPrize? exactMatch = await DbContext.ContestPrizes
                .FirstOrDefaultAsync(x => x.ContestId == request.ContestId && x.MinRank == request.MinRank && x.MaxRank == request.MaxRank, ct);

            if (exactMatch != null)
            {
                exactMatch.CourseId = request.CourseId;
                await DbContext.SaveChangesAsync(ct);
                return new ResultIdDto { Id = exactMatch.Id };
            }
            else
            {
                throw new BusinessException(ErrorCode.Unknown, "This prize range overlaps with an existing prize.");
            }
        }

        ContestPrize prize = new(Guid.NewGuid(), request.ContestId, request.CourseId, request.MinRank, request.MaxRank);
        await DbContext.ContestPrizes.AddAsync(prize, ct);
        await DbContext.SaveChangesAsync(ct);

        return new ResultIdDto { Id = prize.Id };
    }
}
