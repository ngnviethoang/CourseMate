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
    public async Task Handle_ShouldReturnLessonWithSortOrder_WhenStudentIsEnrolled()
    {
        GetLessonByIdQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        LessonDto? result = await handler.Handle(
            new GetLessonByIdQuery { Id = _testContainer.SecondLessonId },
            CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(_testContainer.SecondLessonId, result.Id);
        Assert.Equal("a0V", result.Position);
        Assert.Equal(2, result.SortOrder);
    }

    [Fact]
    public async Task Handle_ShouldThrowUnauthorizedAccessException_WhenStudentIsNotEnrolled()
    {
        TestDbContextScope scope = new(Guid.NewGuid(), Roles.Student);
        CourseMateDbContext dbContext = scope.CreateWriteDbContext();
        CourseMateReadOnlyDbContext readOnlyDbContext = scope.CreateReadOnlyDbContext();

        Guid categoryId = Guid.NewGuid();
        Guid courseId = Guid.NewGuid();
        Guid chapterId = Guid.NewGuid();
        Guid lessonId = Guid.NewGuid();

        dbContext.Categories.Add(new Category(categoryId, "Mobile", "Mobile category", true));
        dbContext.Courses.Add(new Course(
            courseId,
            "Mobile 101",
            "Mobile course",
            30,
            "https://example.com/mobile.png",
            true,
            categoryId,
            Guid.NewGuid()));
        dbContext.Chapters.Add(new Chapter(chapterId, courseId, "Chapter", "a0"));
        dbContext.Lessons.Add(new Lesson(lessonId, chapterId, courseId, "Lesson", LessonType.Video, "a0"));
        dbContext.SaveChanges();

        GetLessonByIdQueryHandler handler = new(readOnlyDbContext, scope.HttpContextAccessor);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.Handle(
            new GetLessonByIdQuery { Id = lessonId },
            CancellationToken.None));
    }

    private sealed class TestContainer
    {
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;
        public readonly Guid SecondLessonId = Guid.NewGuid();

        public TestContainer()
        {
            Guid studentId = Guid.NewGuid();
            Guid instructorId = Guid.NewGuid();
            Guid categoryId = Guid.NewGuid();
            Guid courseId = Guid.NewGuid();
            Guid chapterId = Guid.NewGuid();
            Guid firstLessonId = Guid.NewGuid();

            TestDbContextScope scope = new(studentId, Roles.Student);
            HttpContextAccessor = scope.HttpContextAccessor;
            CourseMateDbContext dbContext = scope.CreateWriteDbContext();
            ReadOnlyDbContext = scope.CreateReadOnlyDbContext();

            dbContext.Categories.Add(new Category(categoryId, "Security", "Security category", true));
            dbContext.Courses.Add(new Course(
                courseId,
                "Security course",
                "Security",
                40,
                "https://example.com/security.png",
                true,
                categoryId,
                instructorId));
            dbContext.Chapters.Add(new Chapter(chapterId, courseId, "Chapter 1", "a0"));
            dbContext.Enrollments.Add(new Enrollment(Guid.NewGuid(), studentId, courseId));

            dbContext.Lessons.AddRange(
                new Lesson(firstLessonId, chapterId, courseId, "Lesson 1", LessonType.Video, "a0"),
                new Lesson(SecondLessonId, chapterId, courseId, "Lesson 2", LessonType.Reading, "a0V"));

            dbContext.SaveChanges();
        }
    }
}