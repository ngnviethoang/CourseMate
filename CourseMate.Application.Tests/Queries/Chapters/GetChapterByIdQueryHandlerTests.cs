using CourseMate.Application.Queries.Chapters;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Queries.Chapters;

public class GetChapterByIdQueryHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldReturnChapterWithSortOrder_WhenStudentIsEnrolled()
    {
        GetChapterByIdQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        ChapterDto? result = await handler.Handle(
            new GetChapterByIdQuery { Id = _testContainer.SecondChapterId },
            CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(_testContainer.SecondChapterId, result.Id);
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

        dbContext.Categories.Add(new Category(categoryId, "Cloud", "Cloud category", true));
        dbContext.Courses.Add(new Course(
            courseId,
            "Cloud 101",
            "Cloud course",
            20,
            "https://example.com/cloud.png",
            true,
            categoryId,
            Guid.NewGuid()));
        dbContext.Chapters.Add(new Chapter(chapterId, courseId, "Chapter", "a0"));
        dbContext.SaveChanges();

        GetChapterByIdQueryHandler handler = new(readOnlyDbContext, scope.HttpContextAccessor);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.Handle(
            new GetChapterByIdQuery { Id = chapterId },
            CancellationToken.None));
    }

    private sealed class TestContainer
    {
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;
        public readonly Guid SecondChapterId = Guid.NewGuid();

        public TestContainer()
        {
            Guid studentId = Guid.NewGuid();
            Guid instructorId = Guid.NewGuid();
            Guid categoryId = Guid.NewGuid();
            Guid courseId = Guid.NewGuid();
            Guid firstChapterId = Guid.NewGuid();

            TestDbContextScope scope = new(studentId, Roles.Student);
            HttpContextAccessor = scope.HttpContextAccessor;
            CourseMateDbContext dbContext = scope.CreateWriteDbContext();
            ReadOnlyDbContext = scope.CreateReadOnlyDbContext();

            dbContext.Categories.Add(new Category(categoryId, "Security", "Security category", true));
            dbContext.Courses.Add(new Course(
                courseId,
                "Security 101",
                "Security course",
                35,
                "https://example.com/security.png",
                true,
                categoryId,
                instructorId));
            dbContext.Enrollments.Add(new Enrollment(Guid.NewGuid(), studentId, courseId));

            dbContext.Chapters.AddRange(
                new Chapter(firstChapterId, courseId, "Chapter 1", "a0"),
                new Chapter(SecondChapterId, courseId, "Chapter 2", "a0V"));

            dbContext.SaveChanges();
        }
    }
}