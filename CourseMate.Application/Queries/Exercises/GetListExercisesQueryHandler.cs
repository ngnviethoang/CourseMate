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

public sealed class GetListExercisesQueryHandler : AbstractQueryHandler<GetListExercisesQuery, PagedDto<ExerciseDto>>
{
    public GetListExercisesQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<ExerciseDto>> Handle(GetListExercisesQuery request, CancellationToken ct)
    {
        bool isFilterGuid = Guid.TryParse(request.Filter, out Guid filterId);

        IQueryable<ExerciseDto> query =
            from exercise in DbContext.Exercises
            join user in DbContext.Users on exercise.CreatorId equals user.Id
            join exerciseTestCase in DbContext.ExerciseTestCases
                on exercise.Id equals exerciseTestCase.ExerciseId into testCaseGroup
            select new ExerciseDto
            {
                Id = exercise.Id,
                Title = exercise.Title,
                Description = exercise.Description,
                Difficulty = exercise.Difficulty.ToString(),
                Category = exercise.Category,
                CreatedById = exercise.CreatorId,
                CreatedByName = user.UserName,
                TestCaseCount = testCaseGroup.Count(),
                CreationTime = exercise.CreationTime,
                LastModificationTime = exercise.LastModificationTime
            };

        query = query
            .WhereIf(IsInRole(Roles.Instructor), x => x.CreatedById == CurrentUserId)
            .WhereIf(isFilterGuid, x => x.Id == filterId)
            .WhereIf(!isFilterGuid && !string.IsNullOrWhiteSpace(request.Filter), x => EF.Functions.ILike(x.Title, $"%{request.Filter}%"))
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

        int total = await query.CountAsync(ct);
        List<ExerciseDto> items = await query.Paged(request.PageIndex, request.PageSize).ToListAsync(ct);

        return new PagedDto<ExerciseDto>
        {
            Items = items,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = total
        };
    }
}