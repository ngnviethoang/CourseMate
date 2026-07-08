using CourseMate.Application.Commands.Lessons;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Tests.Commands.Lessons;

public class DeleteLessonCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldDeleteLesson_WhenInstructorDeletesOwnLesson()
    {
        DeleteLessonCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);

        DeleteLessonCommand request = new() { Id = _testContainer.LessonId };

        await handler.Handle(request, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();

        Lesson? deleted = await _testContainer.DbContext.Lessons.FirstOrDefaultAsync(l => l.Id == _testContainer.LessonId);
        Assert.Null(deleted);
    }

    [Fact]
    public async Task Handle_ShouldThrowUnauthorizedAccessException_WhenOtherInstructorTriesToDelete()
    {
        Guid otherInstructorId = Guid.NewGuid();
        TestDbContextScope otherScope = new(otherInstructorId, Roles.Instructor);
        CourseMateDbContext otherDbContext = otherScope.CreateWriteDbContext();

        otherDbContext.Categories.Add(new Category(_testContainer.CategoryId, "Programming", "Programming", true));
        otherDbContext.Courses.Add(new Course(_testContainer.CourseId, "Test Course", "Desc", 99, "https://img.png", true, _testContainer.CategoryId, _testContainer.InstructorId));
        otherDbContext.Chapters.Add(new Chapter(_testContainer.ChapterId, _testContainer.CourseId, "Chapter 1", "a0"));
        otherDbContext.Lessons.Add(new Lesson(_testContainer.LessonId, _testContainer.ChapterId, _testContainer.CourseId, "Lesson 1", LessonType.Video, "a0"));
        await otherDbContext.SaveChangesAsync();

        DeleteLessonCommandHandler handler = new(otherDbContext, otherScope.HttpContextAccessor);

        DeleteLessonCommand request = new() { Id = _testContainer.LessonId };

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.Handle(request, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_ShouldAllowAdminToDeleteAnyLesson()
    {
        TestDbContextScope adminScope = new(Guid.NewGuid(), Roles.Admin);
        CourseMateDbContext adminDbContext = adminScope.CreateWriteDbContext();

        adminDbContext.Categories.Add(new Category(_testContainer.CategoryId, "Programming", "Programming", true));
        adminDbContext.Courses.Add(new Course(_testContainer.CourseId, "Test Course", "Desc", 99, "https://img.png", true, _testContainer.CategoryId, _testContainer.InstructorId));
        adminDbContext.Chapters.Add(new Chapter(_testContainer.ChapterId, _testContainer.CourseId, "Chapter 1", "a0"));
        adminDbContext.Lessons.Add(new Lesson(_testContainer.LessonId, _testContainer.ChapterId, _testContainer.CourseId, "Lesson 1", LessonType.Video, "a0"));
        await adminDbContext.SaveChangesAsync();

        DeleteLessonCommandHandler handler = new(adminDbContext, adminScope.HttpContextAccessor);

        DeleteLessonCommand request = new() { Id = _testContainer.LessonId };

        Unit result = await handler.Handle(request, CancellationToken.None);
        await adminDbContext.SaveChangesAsync();

        Assert.Equal(Unit.Value, result);
        Lesson? deleted = await adminDbContext.Lessons.FirstOrDefaultAsync(l => l.Id == _testContainer.LessonId);
        Assert.Null(deleted);
    }

    private sealed class TestContainer
    {
        public readonly Guid CategoryId = Guid.NewGuid();
        public readonly Guid ChapterId = Guid.NewGuid();
        public readonly Guid CourseId = Guid.NewGuid();
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid InstructorId = Guid.NewGuid();
        public readonly Guid LessonId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope scope = new(InstructorId, Roles.Instructor);
            HttpContextAccessor = scope.HttpContextAccessor;
            DbContext = scope.CreateWriteDbContext();

            DbContext.Categories.Add(new Category(CategoryId, "Programming", "Programming", true));
            DbContext.Courses.Add(new Course(
                CourseId, "Test Course", "Description", 99, "https://example.com/course.png", true, CategoryId, InstructorId));
            DbContext.Chapters.Add(new Chapter(ChapterId, CourseId, "Chapter 1", "a0"));
            DbContext.Lessons.Add(new Lesson(LessonId, ChapterId, CourseId, "Lesson 1", LessonType.Video, "a0"));

            DbContext.SaveChanges();
        }
    }
}