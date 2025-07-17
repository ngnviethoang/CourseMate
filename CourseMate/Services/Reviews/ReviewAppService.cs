using System.Linq.Dynamic.Core;
using CourseMate.Entities.Reviews;
using CourseMate.Permissions;
using CourseMate.Services.Dtos.Reviews;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;

namespace CourseMate.Services.Reviews;

[Authorize(CourseMatePermissions.Reviews.Default)]
public class ReviewAppService : CourseMateAppService, IReviewAppService
{
    public async Task<ReviewDto> GetAsync(Guid id)
    {
        Review review = await ReviewRepo.GetAsync(id);
        return ObjectMapper.Map<Review, ReviewDto>(review);
    }

    public async Task<PagedResultDto<ReviewDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        IQueryable<Review> queryable = await ReviewRepo.GetQueryableAsync();
        IQueryable<Review> query = queryable
            .OrderBy(input.Sorting.IsNullOrWhiteSpace() ? "Name" : input.Sorting)
            .Skip(input.SkipCount)
            .Take(input.MaxResultCount);

        List<Review> reviews = await AsyncExecuter.ToListAsync(query);
        int totalCount = await AsyncExecuter.CountAsync(queryable);

        return new PagedResultDto<ReviewDto>(totalCount, ObjectMapper.Map<List<Review>, List<ReviewDto>>(reviews)
        );
    }

    [Authorize(CourseMatePermissions.Reviews.Create)]
    public async Task<ReviewDto> CreateAsync(CreateUpdateReviewDto input)
    {
        await UserRepo.EnsureExistsAsync(input.StudentId);
        await CourseRepo.EnsureExistsAsync(input.CourseId);
        Review review = ObjectMapper.Map<CreateUpdateReviewDto, Review>(input);
        await ReviewRepo.InsertAsync(review);
        return ObjectMapper.Map<Review, ReviewDto>(review);
    }

    [Authorize(CourseMatePermissions.Reviews.Edit)]
    public async Task<ReviewDto> UpdateAsync(Guid id, CreateUpdateReviewDto input)
    {
        Review review = await ReviewRepo.GetAsync(id);
        await UserRepo.EnsureExistsAsync(input.StudentId);
        await CourseRepo.EnsureExistsAsync(input.CourseId);
        ObjectMapper.Map(input, review);
        await ReviewRepo.UpdateAsync(review);
        return ObjectMapper.Map<Review, ReviewDto>(review);
    }

    [Authorize(CourseMatePermissions.Reviews.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        await ReviewRepo.DeleteAsync(id);
    }
}