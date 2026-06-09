using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Contests;

public class GetContestExercisesQuery : IRequest<List<ContestExerciseDto>>
{
    public Guid ContestId { get; set; }
}

public sealed class GetContestExercisesQueryHandler : AbstractQueryHandler<GetContestExercisesQuery, List<ContestExerciseDto>>
{
    public GetContestExercisesQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<List<ContestExerciseDto>> Handle(GetContestExercisesQuery request, CancellationToken ct)
    {
        Contest? contest = await DbContext.Contests.FirstOrDefaultAsync(x => x.Id == request.ContestId, ct);
        if (contest == null)
        {
            throw new KeyNotFoundException("Contest not found.");
        }

        if (IsInRole(Roles.Student))
        {
            if (contest.Status == ContestStatus.Draft || contest.Status == ContestStatus.Upcoming)
            {
                return new List<ContestExerciseDto>();
            }
        }

        return await (
            from ce in DbContext.ContestExercises
            join e in DbContext.Exercises on ce.ExerciseId equals e.Id
            where ce.ContestId == request.ContestId
            where !(IsInRole(Roles.Student) && e.IsHidden)
            orderby ce.Order
            select new ContestExerciseDto
            {
                Id = ce.Id,
                ExerciseId = e.Id,
                Title = e.Title,
                Description = e.Description,
                ScoreWeight = ce.ScoreWeight,
                Order = ce.Order,
                IsPassed = false
            }).ToListAsync(ct);
    }
}