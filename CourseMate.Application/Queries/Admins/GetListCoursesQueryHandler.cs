using CourseMate.Contract.DTOs;
using CourseMate.Contract.DTOs.Admins;
using CourseMate.Core;
using CourseMate.Core.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Admins;

internal sealed class GetListCoursesQueryHandler : IRequestHandler<GetListCoursesQuery, PagedDto<CourseDto>>
{
    private readonly CourseMateReadOnlyDbContext _dbContext;

    public GetListCoursesQueryHandler(CourseMateReadOnlyDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedDto<CourseDto>> Handle(GetListCoursesQuery request, CancellationToken cancellationToken)
    {
        IQueryable<Course> baseQuery = _dbContext.Courses.AsQueryable();

        if (!string.IsNullOrEmpty(request.Filter))
        {
            baseQuery = baseQuery.Where(x => x.Title.Contains(request.Filter));
        }

        IQueryable<CourseDto> query = from course in baseQuery
            join category in _dbContext.Categories on course.CategoryId equals category.Id
            join instructor in _dbContext.Users on course.InstructorId equals instructor.Id
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

        List<CourseDto> courses = await query
            .Skip((request.PageIndex - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedDto<CourseDto>
        {
            Items = courses,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize
        };
    }
}