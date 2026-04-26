using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Exercises;

public class GetListExercisesQuery : GetListQuery<ExerciseDto>
{
    public string? Difficulty { get; set; }
    public string? Category { get; set; }
}

internal sealed class GetListExercisesQueryHandler
    : AbstractQueryHandler<GetListExercisesQuery, PagedDto<ExerciseDto>>
{
    public GetListExercisesQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<ExerciseDto>> Handle(GetListExercisesQuery request, CancellationToken cancellationToken)
    {
        IQueryable<ExerciseDto> query =
            from ex in DbContext.Exercises
            join creator in DbContext.Users on ex.CreatorId equals creator.Id into creatorGroup
            from creator in creatorGroup.DefaultIfEmpty()
            select new ExerciseDto
            {
                Id = ex.Id,
                Title = ex.Title,
                Description = ex.Description,
                Difficulty = ex.Difficulty.ToString(),
                Category = ex.Category,
                CreatedById = ex.CreatorId,
                CreatedByName = creator.UserName,
                TestCaseCount = ex.TestCases.Count(tc => !tc.IsDeleted),
                CreationTime = ex.CreationTime,
                LastModificationTime = ex.LastModificationTime
            };

        query = query
            .WhereIf(IsInRole(Roles.Instructor), x => x.CreatedById == CurrentUserId)
            .WhereIf(!string.IsNullOrWhiteSpace(request.Filter), x => EF.Functions.ILike(x.Title, $"%{request.Filter}%"))
            .WhereIf(!string.IsNullOrWhiteSpace(request.Difficulty), x => x.Difficulty == request.Difficulty)
            .WhereIf(!string.IsNullOrWhiteSpace(request.Category), x => EF.Functions.ILike(x.Category, $"%{request.Category}%"));

        query = request.Sorting switch
        {
            "title" => query.OrderBy(x => x.Title),
            "title_desc" => query.OrderByDescending(x => x.Title),
            "difficulty" => query.OrderBy(x => x.Difficulty),
            "creationTime_desc" => query.OrderByDescending(x => x.CreationTime),
            _ => query.OrderByDescending(x => x.CreationTime)
        };

        int total = await query.CountAsync(cancellationToken);
        List<ExerciseDto> items = await query.Paged(request.PageIndex, request.PageSize).ToListAsync(cancellationToken);

        return new PagedDto<ExerciseDto>
        {
            Items = items,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = total
        };
    }
}