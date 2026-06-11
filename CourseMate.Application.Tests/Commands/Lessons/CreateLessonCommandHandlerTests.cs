using CourseMate.Application.Commands.Lessons;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Commands.Lessons;

public class CreateLessonCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldCreateLesson_WhenInstructorOwnerCreateLesson()
    {
        CreateLessonCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);

        CreateLessonCommand request = new()
        {
            CourseId = _testContainer.CourseId,
            ChapterId = _testContainer.ChapterId,
            Title = "Lesson One",
            LessonType = LessonType.Video,
            SortOrder = 1
        };

        ResultIdDto result = await handler.Handle(request, CancellationToken.None);

        Assert.NotEqual(Guid.Empty, result.Id);
    }

    [Fact]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenCourseNotFound()
    {
        CreateLessonCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);

        CreateLessonCommand request = new()
        {
            CourseId = Guid.NewGuid(),
            ChapterId = _testContainer.ChapterId,
            Title = "Lesson",
            LessonType = LessonType.Video,
            SortOrder = 1
        };

        await Assert.ThrowsAsync<EntityNotFoundException>(() => handler.Handle(request, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenChapterNotFound()
    {
        CreateLessonCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);

        CreateLessonCommand request = new()
        {
            CourseId = _testContainer.CourseId,
            ChapterId = Guid.NewGuid(),
            Title = "Lesson",
            LessonType = LessonType.Video,
            SortOrder = 1
        };

        await Assert.ThrowsAsync<EntityNotFoundException>(() => handler.Handle(request, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_ShouldThrowUnauthorizedAccessException_WhenOtherInstructorTriesToCreate()
    {
        Guid otherInstructorId = Guid.NewGuid();
        TestDbContextScope otherScope = new(otherInstructorId, Roles.Instructor);
        CourseMateDbContext otherDbContext = otherScope.CreateWriteDbContext();

        otherDbContext.Categories.Add(new Category(_testContainer.CategoryId, "Programming", "Programming", true));
        otherDbContext.Courses.Add(new Course(_testContainer.CourseId, "Test Course", "Desc", 99, "https://img.png", true, _testContainer.CategoryId, _testContainer.InstructorId));
        otherDbContext.Chapters.Add(new Chapter(_testContainer.ChapterId, _testContainer.CourseId, "Chapter 1", "a0"));
        await otherDbContext.SaveChangesAsync();

        CreateLessonCommandHandler handler = new(otherDbContext, otherScope.HttpContextAccessor);

        CreateLessonCommand request = new()
        {
            CourseId = _testContainer.CourseId,
            ChapterId = _testContainer.ChapterId,
            Title = "Lesson",
            LessonType = LessonType.Video,
            SortOrder = 1
        };

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.Handle(request, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_ShouldThrowBusinessException_WhenSortOrderOutOfRange()
    {
        CreateLessonCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);

        CreateLessonCommand request = new()
        {
            CourseId = _testContainer.CourseId,
            ChapterId = _testContainer.ChapterId,
            Title = "Lesson",
            LessonType = LessonType.Video,
            SortOrder = 99
        };

        await Assert.ThrowsAsync<BusinessException>(() => handler.Handle(request, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_ShouldAllowAdminToCreateLesson()
    {
        TestDbContextScope adminScope = new(Guid.NewGuid(), Roles.Admin);
        CourseMateDbContext adminDbContext = adminScope.CreateWriteDbContext();

        adminDbContext.Categories.Add(new Category(_testContainer.CategoryId, "Programming", "Programming", true));
        adminDbContext.Courses.Add(new Course(_testContainer.CourseId, "Test Course", "Desc", 99, "https://img.png", true, _testContainer.CategoryId, _testContainer.InstructorId));
        adminDbContext.Chapters.Add(new Chapter(_testContainer.ChapterId, _testContainer.CourseId, "Chapter 1", "a0"));
        await adminDbContext.SaveChangesAsync();

        CreateLessonCommandHandler handler = new(adminDbContext, adminScope.HttpContextAccessor);

        CreateLessonCommand request = new()
        {
            CourseId = _testContainer.CourseId,
            ChapterId = _testContainer.ChapterId,
            Title = "Admin Lesson",
            LessonType = LessonType.Reading,
            SortOrder = 1
        };

        ResultIdDto result = await handler.Handle(request, CancellationToken.None);

        Assert.NotEqual(Guid.Empty, result.Id);
    }

    private sealed class TestContainer
    {
        public readonly Guid CategoryId = Guid.NewGuid();
        public readonly Guid ChapterId = Guid.NewGuid();
        public readonly Guid CourseId = Guid.NewGuid();
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid InstructorId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope scope = new(InstructorId, Roles.Instructor);
            HttpContextAccessor = scope.HttpContextAccessor;
            DbContext = scope.CreateWriteDbContext();

            DbContext.Categories.Add(new Category(CategoryId, "Programming", "Programming", true));
            DbContext.Courses.Add(new Course(
                CourseId, "Test Course", "Description", 99, "https://example.com/course.png", true, CategoryId, InstructorId));
            DbContext.Chapters.Add(new Chapter(ChapterId, CourseId, "Chapter 1", "a0"));

            DbContext.SaveChanges();
        }
    }
}