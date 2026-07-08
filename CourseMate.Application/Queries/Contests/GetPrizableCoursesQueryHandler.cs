using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Contests;

public class GetPrizableCoursesQuery : IRequest<List<PrizableCourseDto>>
{
    public Guid ContestId { get; set; }
}

public class PrizableCourseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string InstructorName { get; set; } = string.Empty;
}

public sealed class GetPrizableCoursesQueryHandler : AbstractQueryHandler<GetPrizableCoursesQuery, List<PrizableCourseDto>>
{
    public GetPrizableCoursesQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<List<PrizableCourseDto>> Handle(GetPrizableCoursesQuery request, CancellationToken ct)
    {
        bool isAdmin = IsInRole(Roles.Admin);

        // Admin sees all published courses; Instructor sees only their own
        IQueryable<Course> query = DbContext.Courses
            .Where(c => c.IsPublished);

        if (!isAdmin)
        {
            query = query.Where(c => c.InstructorId == CurrentUserId);
        }

        List<PrizableCourseDto> courses = await (
            from c in query
            join u in DbContext.Users on c.InstructorId equals u.Id
            select new PrizableCourseDto
            {
                Id = c.Id,
                Title = c.Title,
                ImageUrl = c.ImageUrl,
                Price = c.Price,
                InstructorName = u.UserName ?? "Unknown"
            }
        ).ToListAsync(ct);

        return courses;
    }
}