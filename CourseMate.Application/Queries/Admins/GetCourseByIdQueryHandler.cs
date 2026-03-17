using CourseMate.Contract.DTOs.Admins;
using CourseMate.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Admins;

internal sealed class GetCourseByIdQueryHandler : IRequestHandler<GetCourseByIdQuery, CourseDto?>
{
    private readonly CourseMateReadOnlyDbContext _dbContext;

    public GetCourseByIdQueryHandler(CourseMateReadOnlyDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CourseDto?> Handle(GetCourseByIdQuery request, CancellationToken cancellationToken)
    {
        IQueryable<CourseDto> query = from course in _dbContext.Courses
            join category in _dbContext.Categories on course.CategoryId equals category.Id
            join instructor in _dbContext.Users on course.InstructorId equals instructor.Id
            where course.Id == request.Id
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
                InstructorName = instructor.UserName
            };

        CourseDto? result = await query.FirstOrDefaultAsync(cancellationToken);

        return result;
    }
}