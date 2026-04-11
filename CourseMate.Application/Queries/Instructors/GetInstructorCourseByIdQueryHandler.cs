using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Instructors;

public class GetInstructorCourseByIdQuery : IRequest<CourseDto?>
{
    public Guid Id { get; set; }
}

internal sealed class GetInstructorCourseByIdQueryHandler
    : AbstractQueryHandler<GetInstructorCourseByIdQuery, CourseDto?>
{
    public GetInstructorCourseByIdQueryHandler(
        CourseMateReadOnlyDbContext dbContext,
        IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<CourseDto?> Handle(
        GetInstructorCourseByIdQuery request,
        CancellationToken cancellationToken)
    {
        Guid instructorId = GetCurrentUserId();

        CourseDto? result = await (
            from course in DbContext.Courses
            join category in DbContext.Categories on course.CategoryId equals category.Id
            join instructor in DbContext.Users on course.InstructorId equals instructor.Id
            where course.Id == request.Id && course.InstructorId == instructorId
            select new CourseDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                Price = course.Price,
                ImageUrl = course.ImageUrl,
                IsPublished = course.IsPublished,
                CategoryId = course.CategoryId,
                CategoryName = category.Name,
                InstructorId = course.InstructorId,
                InstructorName = instructor.UserName,
                CreationTime = course.CreationTime,
                LastModificationTime = course.LastModificationTime
            }
        ).FirstOrDefaultAsync(cancellationToken);

        return result;
    }
}