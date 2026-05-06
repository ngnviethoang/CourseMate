using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Contests;

public class GetListContestsQuery : GetListQuery<ContestDto>
{
    public ContestStatus? Status { get; set; }
}

internal sealed class GetListContestsQueryHandler : AbstractQueryHandler<GetListContestsQuery, PagedDto<ContestDto>>
{
    public GetListContestsQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<ContestDto>> Handle(GetListContestsQuery request, CancellationToken ct)
    {
        IQueryable<ContestDto> query =
            from contest in DbContext.Contests
            join user in DbContext.Users on contest.CreatorId equals user.Id
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
                ParticipantCount = DbContext.ContestRegistrations.Count(x => x.ContestId == contest.Id)
            };

        query = query
            .WhereIf(IsInRole(Roles.Instructor), x => x.CreatorId == CurrentUserId)
            .WhereIf(IsInRole(Roles.Student), x => x.Status != ContestStatus.Draft)
            .WhereIf(!string.IsNullOrWhiteSpace(request.Filter), x => EF.Functions.ILike(x.Title, $"%{request.Filter}%"))
            .WhereIf(request.Status.HasValue, x => x.Status == request.Status);

        query = request.Sorting switch
        {
            "title" => query.OrderBy(x => x.Title),
            "title_desc" => query.OrderByDescending(x => x.Title),
            "startTime" => query.OrderBy(x => x.StartTime),
            "startTime_desc" => query.OrderByDescending(x => x.StartTime),
            _ => query.OrderByDescending(x => x.CreationTime)
        };

        int total = await query.CountAsync(ct);
        List<ContestDto> items = await query.Paged(request.PageIndex, request.PageSize).ToListAsync(ct);

        return new PagedDto<ContestDto>
        {
            Items = items,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = total
        };
    }
}