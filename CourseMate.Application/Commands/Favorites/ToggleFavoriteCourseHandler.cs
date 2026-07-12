using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Favorites;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Favorites;

public class ToggleFavoriteCourseCommand : IRequest<bool>
{
    public Guid CourseId { get; set; }
    public bool IsFavorite { get; set; }
}

public sealed class ToggleFavoriteCourseHandler : AbstractCommandHandler<ToggleFavoriteCourseCommand, bool>
{
    public ToggleFavoriteCourseHandler(
        CourseMateDbContext courseMateDbContext,
        IHttpContextAccessor httpContextAccessor
    ) : base(courseMateDbContext, httpContextAccessor)
    {
    }

    public override async Task<bool> Handle(ToggleFavoriteCourseCommand request, CancellationToken ct)
    {
        string courseKey = $"course:{request.CourseId}";

        CourseMate.Persistent.Entities.StudentPreference? pref =
            await DbContext.StudentPreferences
                .FirstOrDefaultAsync(p => p.StudentId == CurrentUserId, ct);

        if (pref == null)
        {
            if (!request.IsFavorite)
            {
                return false;
            }

            pref = new CourseMate.Persistent.Entities.StudentPreference(Guid.NewGuid(), CurrentUserId)
            {
                FavouriteCategories = new List<string> { courseKey }
            };
            await DbContext.StudentPreferences.AddAsync(pref, ct);
        }
        else
        {
            List<string> list = pref.FavouriteCategories.ToList();

            if (request.IsFavorite)
            {
                if (!list.Contains(courseKey))
                {
                    list.Add(courseKey);
                }
            }
            else
            {
                list.Remove(courseKey);
            }

            pref.FavouriteCategories = list;
            DbContext.StudentPreferences.Update(pref);
        }

        await DbContext.SaveChangesAsync(ct);
        return request.IsFavorite;
    }
}
