using CourseMate.Application.Queries.Courses;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;

namespace CourseMate.Application.Tests.Queries.Courses;

public class GetOutlineQueryHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldReturnOutline_WhenLessonExists()
    {
        Mock<ILogger<GetOutlineQueryHandler>> mockLogger = new();
        GetOutlineQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor, mockLogger.Object);

        GetOutlineQuery query = new() { LessonId = _testContainer.LessonId };

        OutlineDto? result = await handler.Handle(query, CancellationToken.None);

        Assert.NotNull(result);
    }

    [Fact]
    public async Task Handle_ShouldReturnEmptyOutline_WhenLessonHasNoMaterial()
    {
        Mock<ILogger<GetOutlineQueryHandler>> mockLogger = new();
        GetOutlineQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor, mockLogger.Object);

        GetOutlineQuery query = new() { LessonId = Guid.NewGuid() };

        OutlineDto? result = await handler.Handle(query, CancellationToken.None);

        Assert.NotNull(result);
    }

    private sealed class TestContainer
    {
        public readonly Guid ChapterId = Guid.NewGuid();
        public readonly Guid CourseId = Guid.NewGuid();
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid InstructorId = Guid.NewGuid();
        public readonly Guid LessonId = Guid.NewGuid();
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;

        public TestContainer()
        {
            TestDbContextScope scope = new(Guid.NewGuid(), Roles.Student);
            HttpContextAccessor = scope.HttpContextAccessor;
            CourseMateDbContext dbContext = scope.CreateWriteDbContext();
            ReadOnlyDbContext = scope.CreateReadOnlyDbContext();

            dbContext.Users.Add(new User("instructor") { Id = InstructorId });
            dbContext.Courses.Add(new Course(CourseId, "Test Course", "Desc", 99, "https://example.com/img.png", true, Guid.NewGuid(), InstructorId));
            dbContext.Chapters.Add(new Chapter(ChapterId, CourseId, "Chapter 1", "a0"));
            dbContext.Lessons.Add(new Lesson(LessonId, ChapterId, CourseId, "Lesson 1", LessonType.Video, "a0"));
            dbContext.SaveChanges();
        }
    }
}