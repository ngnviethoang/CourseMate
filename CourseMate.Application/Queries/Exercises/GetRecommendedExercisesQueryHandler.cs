using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Exercises;

public class GetRecommendedExercisesQuery : IRequest<PagedDto<ExerciseDto>>
{
    public int PageIndex { get; set; } = 1;
    public int PageSize { get; set; } = 5;
}

internal sealed class GetRecommendedExercisesQueryHandler : AbstractQueryHandler<GetRecommendedExercisesQuery, PagedDto<ExerciseDto>>
{
    public GetRecommendedExercisesQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<ExerciseDto>> Handle(GetRecommendedExercisesQuery request, CancellationToken ct)
    {
        Guid studentId = CurrentUserId;

        HashSet<string> preferredCategories = await (
            from course in DbContext.Courses
            where DbContext.OrderItems.Any(oi =>
                oi.CourseId == course.Id
                && DbContext.Orders.Any(o => o.Id == oi.OrderId && o.StudentId == studentId && o.Status == OrderStatus.Completed))
            join category in DbContext.Categories on course.CategoryId equals category.Id
            select category.Name
        ).ToHashSetAsync(ct);

        const int candidateLimit = 500;
        List<ExerciseDto> fetched = await (
            from exercise in DbContext.Exercises
            join user in DbContext.Users on exercise.CreatorId equals user.Id
            join testCase in DbContext.ExerciseTestCases
                on exercise.Id equals testCase.ExerciseId into testCaseGroup
            where !exercise.IsDeleted
            orderby (
                    from s in DbContext.ExerciseSubmissions
                    where s.ExerciseId == exercise.Id && s.IsPassed
                    select s.Id
                ).Count() descending,
                exercise.CreationTime descending
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
            }
        ).Take(candidateLimit).ToListAsync(ct);

        bool hasSignal = preferredCategories.Count > 0;

        List<ExerciseDto> ordered = hasSignal
            ? fetched
                .OrderByDescending(e => preferredCategories.Contains(e.Category))
                .ThenByDescending(e => e.CreationTime)
                .ToList()
            : fetched;

        int totalCount = ordered.Count;
        List<ExerciseDto> page = ordered
            .Skip((request.PageIndex - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();

        return new PagedDto<ExerciseDto>
        {
            Items = page,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = totalCount
        };
    }
}