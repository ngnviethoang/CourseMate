using CourseMate.Application.Queries.Chapters;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Queries.Chapters;

public class GetListChaptersQueryHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldReturnOrderedChaptersWithSortOrder_WhenStudentIsEnrolled()
    {
        GetListChaptersQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        PagedDto<ChapterDto> result = await handler.Handle(
            new GetListChaptersQuery
            {
                CourseId = _testContainer.CourseId,
                Sorting = "position",
                PageIndex = 1,
                PageSize = 10
            },
            CancellationToken.None);

        Assert.Equal(3, result.TotalCount);
        Assert.Equal(3, result.Items.Count());

        List<ChapterDto> items = result.Items.ToList();
        Assert.Equal(_testContainer.FirstChapterId, items[0].Id);
        Assert.Equal("a0", items[0].Position);
        Assert.Equal(1, items[0].SortOrder);

        Assert.Equal(_testContainer.SecondChapterId, items[1].Id);
        Assert.Equal("a0V", items[1].Position);
        Assert.Equal(2, items[1].SortOrder);

        Assert.Equal(_testContainer.ThirdChapterId, items[2].Id);
        Assert.Equal("a1", items[2].Position);
        Assert.Equal(3, items[2].SortOrder);
    }

    [Fact]
    public async Task Handle_ShouldThrowUnauthorizedAccessException_WhenStudentIsNotEnrolled()
    {
        TestDbContextScope scope = new(Guid.NewGuid(), Roles.Student);
        CourseMateDbContext dbContext = scope.CreateWriteDbContext();
        CourseMateReadOnlyDbContext readOnlyDbContext = scope.CreateReadOnlyDbContext();

        Guid categoryId = Guid.NewGuid();
        Guid instructorId = Guid.NewGuid();
        Guid courseId = Guid.NewGuid();
        dbContext.Categories.Add(new Category(categoryId, "AI", "AI category", true));
        dbContext.Courses.Add(new Course(
            courseId,
            "AI 101",
            "Intro",
            10,
            "https://example.com/ai.png",
            true,
            categoryId,
            instructorId));
        dbContext.Chapters.Add(new Chapter(Guid.NewGuid(), courseId, "Chapter 1", "a0"));
        dbContext.SaveChanges();

        GetListChaptersQueryHandler handler = new(readOnlyDbContext, scope.HttpContextAccessor);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.Handle(
            new GetListChaptersQuery
            {
                CourseId = courseId,
                PageIndex = 1,
                PageSize = 10
            },
            CancellationToken.None));
    }

    private sealed class TestContainer
    {
        public readonly Guid CourseId = Guid.NewGuid();
        public readonly Guid FirstChapterId = Guid.NewGuid();
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;
        public readonly Guid SecondChapterId = Guid.NewGuid();
        public readonly Guid ThirdChapterId = Guid.NewGuid();

        public TestContainer()
        {
            Guid studentId = Guid.NewGuid();
            Guid instructorId = Guid.NewGuid();
            Guid categoryId = Guid.NewGuid();

            TestDbContextScope scope = new(studentId, Roles.Student);
            HttpContextAccessor = scope.HttpContextAccessor;
            CourseMateDbContext dbContext = scope.CreateWriteDbContext();
            ReadOnlyDbContext = scope.CreateReadOnlyDbContext();

            dbContext.Categories.Add(new Category(categoryId, "Backend", "Backend category", true));
            dbContext.Courses.Add(new Course(
                CourseId,
                "Backend fundamentals",
                "Course",
                50,
                "https://example.com/backend.png",
                true,
                categoryId,
                instructorId));
            dbContext.Enrollments.Add(new Enrollment(Guid.NewGuid(), studentId, CourseId));

            dbContext.Chapters.AddRange(
                new Chapter(ThirdChapterId, CourseId, "Chapter 3", "a1"),
                new Chapter(FirstChapterId, CourseId, "Chapter 1", "a0"),
                new Chapter(SecondChapterId, CourseId, "Chapter 2", "a0V"));

            dbContext.SaveChanges();
        }
    }
}