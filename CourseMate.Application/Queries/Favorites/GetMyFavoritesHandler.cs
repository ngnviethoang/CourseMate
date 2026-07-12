using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Favorites;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Favorites;

public class GetMyFavoritesQuery : IRequest<List<FavoriteCourseDto>>
{
    public int Limit { get; set; } = 50;
}

public sealed class GetMyFavoritesHandler : AbstractQueryHandler<GetMyFavoritesQuery, List<FavoriteCourseDto>>
{
    public GetMyFavoritesHandler(
        CourseMateReadOnlyDbContext dbContext,
        IHttpContextAccessor httpContextAccessor
    ) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<List<FavoriteCourseDto>> Handle(GetMyFavoritesQuery request, CancellationToken ct)
    {
        CourseMate.Persistent.Entities.StudentPreference? pref =
            await DbContext.StudentPreferences
                .FirstOrDefaultAsync(p => p.StudentId == CurrentUserId, ct);

        if (pref == null || pref.FavouriteCategories.Count == 0)
        {
            return [];
        }

        List<string> courseKeys = pref.FavouriteCategories
            .Where(k => k.StartsWith("course:"))
            .Select(k => k["course:".Length..])
            .ToList();

        if (courseKeys.Count == 0)
        {
            return [];
        }

        List<Guid> courseIds = courseKeys
            .Select(idStr => Guid.TryParse(idStr, out Guid g) ? g : Guid.Empty)
            .Where(g => g != Guid.Empty)
            .ToList();

        List<FavoriteCourseDto> results = await (
                from course in DbContext.Courses
                where courseIds.Contains(course.Id) && course.IsPublished
                join category in DbContext.Categories on course.CategoryId equals category.Id into catGroup
                from category in catGroup.DefaultIfEmpty()
                join user in DbContext.Users on course.InstructorId equals user.Id into userGroup
                from user in userGroup.DefaultIfEmpty()
                select new FavoriteCourseDto
                {
                    Id = course.Id,
                    CourseId = course.Id,
                    Title = course.Title,
                    ImageUrl = course.ImageUrl,
                    Price = course.Price,
                    CategoryName = category != null ? category.Name : string.Empty,
                    InstructorName = user != null ? user.UserName ?? string.Empty : string.Empty,
                    AddedAt = DateTime.UtcNow
                })
            .Take(request.Limit)
            .ToListAsync(ct);

        return results;
    }
}
