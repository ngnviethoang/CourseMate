using CourseMate.Entities.Lessons;
using CourseMate.Entities.UserProgresses;
using CourseMate.Services.Dtos.UserProgresses;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Validation;

namespace CourseMate.Services.UserProgresses;

[Authorize]
public class UserProgressAppService : CourseMateAppService, IUserProgressAppService
{
    public async Task<CourseProgressDto> GetAsync(Guid courseId)
    {
        IQueryable<CourseProgressDto> courseQuery =
            from course in await CourseRepo.GetQueryableAsync()
            where course.Id == courseId
            select new CourseProgressDto
            {
                CourseId = course.Id,
                Title = course.Title
            };

        CourseProgressDto? courseDto = await AsyncExecuter.FirstOrDefaultAsync(courseQuery);
        if (courseDto == null)
        {
            return new CourseProgressDto();
        }

        IQueryable<ChapterProgressDto> chaptersQuery =
            from chapter in await ChapterRepo.GetQueryableAsync()
            join lesson in await LessonRepo.GetQueryableAsync()
                on chapter.Id equals lesson.ChapterId
            where chapter.CourseId == courseId
            group lesson by chapter
            into g
            orderby g.Key.Position
            select new ChapterProgressDto
            {
                ChapterId = g.Key.Id,
                Title = g.Key.Title,
                Position = g.Key.Position,
                CourseId = g.Key.CourseId,
                Lessons = g.OrderBy(l => l.Position).Select(l => new LessonProgressDto
                {
                    LessonId = l.Id,
                    Title = l.Title,
                    ChapterId = l.ChapterId,
                    Duration = l.Duration,
                    Position = l.Position,
                    Type = l.Type
                })
            };

        courseDto.Chapters = await AsyncExecuter.ToListAsync(chaptersQuery);

        List<LessonProgressDto> lessons = courseDto.Chapters.SelectMany(c => c.Lessons).ToList();
        IEnumerable<Guid> lessonIds = lessons.Select(l => l.LessonId);

        IQueryable<UserProgress> userProgressQuery =
            from userProgress in await UserProgressRepo.GetQueryableAsync()
            join lesson in await LessonRepo.GetQueryableAsync()
                on userProgress.LessonId equals lesson.Id
            where userProgress.UserId == CurrentUser.Id
                  && lessonIds.Contains(lesson.Id)
            select userProgress;

        List<UserProgress> userProgresses = await AsyncExecuter.ToListAsync(userProgressQuery);

        Dictionary<Guid, LessonProgressDto> lessonDict = lessons.ToDictionary(l => l.LessonId);

        foreach (UserProgress progress in userProgresses)
        {
            if (lessonDict.TryGetValue(progress.LessonId, out LessonProgressDto? lessonDto))
            {
                lessonDto.UserProgressId = progress.Id;
                lessonDto.WatchedDuration = progress.WatchedDuration;
                lessonDto.IsCompleted = progress.IsCompleted;
            }
        }

        // Fake api
        Random random = new();
        lessons.ForEach(l => l.Type = (LessonType)random.Next(0, 5));
        return courseDto;
    }

    public async Task UpdateAsync(CreateUpdateUserProgressDto input)
    {
        await UserRepo.EnsureExistsAsync(CurrentUser.Id.GetValueOrDefault());
        await LessonRepo.EnsureExistsAsync(input.LessonId);

        IQueryable<TimeSpan> lessonDurationQuery =
            from lesson in await LessonRepo.GetQueryableAsync()
            where lesson.Id == input.LessonId
            select lesson.Duration;

        TimeSpan lessonDuration = await AsyncExecuter.FirstOrDefaultAsync(lessonDurationQuery);

        if (lessonDuration < input.WatchedDuration)
        {
            throw new AbpValidationException("Watched duration cannot exceed lesson duration.");
        }

        UserProgress? userProgress = await UserProgressRepo.FindAsync(input.UserProgressId.GetValueOrDefault());

        if (userProgress == null)
        {
            userProgress = new UserProgress(
                GuidGenerator.Create(),
                CurrentUser.Id!.Value,
                input.LessonId,
                input.IsCompleted,
                input.WatchedDuration
            );
            await UserProgressRepo.InsertAsync(userProgress);
            return;
        }

        userProgress.IsCompleted = input.IsCompleted;
        userProgress.WatchedDuration = input.WatchedDuration;

        await UserProgressRepo.UpdateAsync(userProgress);
    }
}