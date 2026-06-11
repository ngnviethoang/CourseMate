using CourseMate.Application.Commands.Lessons;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Tests.Commands.Lessons;

public class UpdateLessonProgressCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldCreateNewProgress_WhenNoExistingProgress()
    {
        UpdateLessonProgressCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);

        UpdateLessonProgressCommand request = new()
        {
            LessonId = _testContainer.LessonId,
            IsCompleted = true,
            Score = 90.0
        };

        ResultIdDto result = await handler.Handle(request, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();

        Assert.NotEqual(Guid.Empty, result.Id);

        UserLessonProgress? progress = await _testContainer.DbContext.UserLessonProgresses
            .FirstOrDefaultAsync(p => p.LessonId == _testContainer.LessonId && p.StudentId == _testContainer.StudentId);

        Assert.NotNull(progress);
        Assert.True(progress.IsCompleted);
        Assert.Equal(90.0, progress.Score);
    }

    [Fact]
    public async Task Handle_ShouldUpdateScoreIfHigher_WhenProgressAlreadyExists()
    {
        UserLessonProgress existingProgress = new(Guid.NewGuid(), _testContainer.StudentId, _testContainer.LessonId, false, 50.0);
        _testContainer.DbContext.UserLessonProgresses.Add(existingProgress);
        await _testContainer.DbContext.SaveChangesAsync();

        UpdateLessonProgressCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);

        UpdateLessonProgressCommand request = new()
        {
            LessonId = _testContainer.LessonId,
            IsCompleted = true,
            Score = 80.0
        };

        await handler.Handle(request, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();

        UserLessonProgress? updated = await _testContainer.DbContext.UserLessonProgresses
            .FirstOrDefaultAsync(p => p.Id == existingProgress.Id);

        Assert.NotNull(updated);
        Assert.True(updated.IsCompleted);
        Assert.Equal(80.0, updated.Score);
    }

    [Fact]
    public async Task Handle_ShouldNotUpdateScoreIfLower_WhenProgressAlreadyExists()
    {
        UserLessonProgress existingProgress = new(Guid.NewGuid(), _testContainer.StudentId, _testContainer.LessonId, true, 90.0);
        _testContainer.DbContext.UserLessonProgresses.Add(existingProgress);
        await _testContainer.DbContext.SaveChangesAsync();

        UpdateLessonProgressCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);

        UpdateLessonProgressCommand request = new()
        {
            LessonId = _testContainer.LessonId,
            IsCompleted = false,
            Score = 60.0
        };

        await handler.Handle(request, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();

        UserLessonProgress? updated = await _testContainer.DbContext.UserLessonProgresses
            .FirstOrDefaultAsync(p => p.Id == existingProgress.Id);

        Assert.NotNull(updated);
        // Already completed so should remain completed
        Assert.True(updated.IsCompleted);
        // Score should not decrease
        Assert.Equal(90.0, updated.Score);
    }

    private sealed class TestContainer
    {
        public readonly Guid ChapterId = Guid.NewGuid();
        public readonly Guid CourseId = Guid.NewGuid();
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid LessonId = Guid.NewGuid();
        public readonly Guid StudentId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope scope = new(StudentId, Roles.Student);
            HttpContextAccessor = scope.HttpContextAccessor;
            DbContext = scope.CreateWriteDbContext();

            Guid categoryId = Guid.NewGuid();
            Guid instructorId = Guid.NewGuid();
            DbContext.Categories.Add(new Category(categoryId, "Programming", "Programming", true));
            DbContext.Courses.Add(new Course(CourseId, "Test Course", "Description", 99, "https://example.com/course.png", true, categoryId, instructorId));
            DbContext.Chapters.Add(new Chapter(ChapterId, CourseId, "Chapter 1", "a0"));
            DbContext.Lessons.Add(new Lesson(LessonId, ChapterId, CourseId, "Lesson 1", LessonType.Video, "a0"));

            DbContext.SaveChanges();
        }
    }
}