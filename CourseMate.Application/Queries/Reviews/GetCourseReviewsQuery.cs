using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Reviews;

public class GetCourseReviewsQuery : GetListQuery<ReviewDto>
{
    public Guid CourseId { get; set; }
}

public sealed class GetCourseReviewsQueryHandler : AbstractQueryHandler<GetCourseReviewsQuery, PagedDto<ReviewDto>>
{
    public GetCourseReviewsQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<ReviewDto>> Handle(GetCourseReviewsQuery request, CancellationToken ct)
    {
        IQueryable<ReviewDto> query = from review in DbContext.Reviews
            join student in DbContext.Users on review.StudentId equals student.Id
            where review.CourseId == request.CourseId
            orderby review.CreationTime descending
            select new ReviewDto
            {
                Id = review.Id,
                CourseId = review.CourseId,
                StudentId = review.StudentId,
                StudentName = student.UserName ?? string.Empty,
                StudentAvatar = string.Empty,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreationTime
            };

        int totalRecords = await query.CountAsync(ct);

        List<ReviewDto> items = await query.Paged(request.PageIndex, request.PageSize).ToListAsync(ct);

        return new PagedDto<ReviewDto>
        {
            Items = items,
            TotalCount = totalRecords,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize
        };
    }
}
