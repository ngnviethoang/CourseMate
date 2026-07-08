using CourseMate.Application.Queries.Lessons;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Queries.Lessons;

public class GetLessonByIdQueryHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldReturnLesson_WhenLessonExists()
    {
        GetLessonByIdQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        GetLessonByIdQuery query = new() { Id = _testContainer.LessonId };

        LessonDto? result = await handler.Handle(query, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal("Test Lesson", result.Title);
    }

    [Fact]
    public async Task Handle_ShouldReturnNull_WhenLessonNotFound()
    {
        GetLessonByIdQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        GetLessonByIdQuery query = new() { Id = Guid.NewGuid() };

        LessonDto? result = await handler.Handle(query, CancellationToken.None);

        Assert.Null(result);
    }

    private sealed class TestContainer
    {
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid LessonId = Guid.NewGuid();
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;
        public readonly Guid StudentId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope scope = new(StudentId, Roles.Student);
            HttpContextAccessor = scope.HttpContextAccessor;
            CourseMateDbContext dbContext = scope.CreateWriteDbContext();
            ReadOnlyDbContext = scope.CreateReadOnlyDbContext();

            Guid categoryId = Guid.NewGuid();
            Guid instructorId = Guid.NewGuid();
            Guid courseId = Guid.NewGuid();
            Guid chapterId = Guid.NewGuid();

            dbContext.Categories.Add(new Category(categoryId, "Test", "Test", true));
            dbContext.Users.Add(new User("instructor") { Id = instructorId });
            dbContext.Courses.Add(new Course(courseId, "Test Course", "Desc", 99, "https://img.png", true, categoryId, instructorId));
            dbContext.Chapters.Add(new Chapter(chapterId, courseId, "Chapter 1", "a0"));
            dbContext.Lessons.Add(new Lesson(LessonId, chapterId, courseId, "Test Lesson", LessonType.Video, "a0"));
            dbContext.Enrollments.Add(new Enrollment(Guid.NewGuid(), StudentId, courseId));
            dbContext.SaveChanges();
        }
    }
}