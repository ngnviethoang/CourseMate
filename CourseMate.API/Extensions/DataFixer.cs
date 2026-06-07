using CourseMate.Persistent;
using Microsoft.EntityFrameworkCore;
using CourseMate.Contracts.Shared;

namespace CourseMate.API.Extensions;

public static class DataFixer
{
    public static async Task FixPositionsAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<CourseMateDbContext>();
        
        bool hasChanges = false;

        // Fix Chapters
        var chapters = await dbContext.Chapters.ToListAsync();
        var invalidChaptersGroup = chapters
            .Where(c => c.Position != null && c.Position.Length > 0 && char.IsDigit(c.Position[0]))
            .GroupBy(c => c.CourseId)
            .ToList();

        foreach(var group in invalidChaptersGroup)
        {
            var ordered = group.OrderBy(c => int.Parse(c.Position)).ToList();
            var keys = StringFractionalIndexing.GenerateNKeysBetween(null, null, ordered.Count);
            for (int i = 0; i < ordered.Count; i++)
            {
                ordered[i].Position = keys[i];
                hasChanges = true;
            }
        }

        // Fix Lessons
        var lessons = await dbContext.Lessons.ToListAsync();
        var invalidLessonsGroup = lessons
            .Where(l => l.Position != null && l.Position.Length > 0 && char.IsDigit(l.Position[0]))
            .GroupBy(l => l.ChapterId)
            .ToList();

        foreach(var group in invalidLessonsGroup)
        {
            var ordered = group.OrderBy(l => int.Parse(l.Position)).ToList();
            var keys = StringFractionalIndexing.GenerateNKeysBetween(null, null, ordered.Count);
            for (int i = 0; i < ordered.Count; i++)
            {
                ordered[i].Position = keys[i];
                hasChanges = true;
            }
        }

        if (hasChanges)
        {
            await dbContext.SaveChangesAsync();
        }
    }
}
