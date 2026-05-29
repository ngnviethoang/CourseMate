using CourseMate.Application.Queries.Lessons;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Queries.Lessons;

public class GetListLessonsQueryHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldReturnOrderedLessonsWithSortOrder_WhenStudentIsEnrolled()
    {
        GetListLessonsQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        PagedDto<LessonDto> result = await handler.Handle(
            new GetListLessonsQuery
            {
                CourseId = _testContainer.CourseId,
                ChapterId = _testContainer.ChapterId,
                Sorting = "position",
                PageIndex = 1,
                PageSize = 10
            },
            CancellationToken.None);

        Assert.Equal(3, result.TotalCount);
        Assert.Equal(3, result.Items.Count());

        List<LessonDto> items = result.Items.ToList();
        Assert.Equal(_testContainer.FirstLessonId, items[0].Id);
        Assert.Equal("a0", items[0].Position);
        Assert.Equal(1, items[0].SortOrder);

        Assert.Equal(_testContainer.SecondLessonId, items[1].Id);
        Assert.Equal("a0V", items[1].Position);
        Assert.Equal(2, items[1].SortOrder);

        Assert.Equal(_testContainer.ThirdLessonId, items[2].Id);
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
        Guid courseId = Guid.NewGuid();
        Guid chapterId = Guid.NewGuid();
        dbContext.Categories.Add(new Category(categoryId, "Web", "Web category", true));
        dbContext.Courses.Add(new Course(
            courseId,
            "Web 101",
            "Web course",
            10,
            "https://example.com/web.png",
            true,
            categoryId,
            Guid.NewGuid()));
        dbContext.Chapters.Add(new Chapter(chapterId, courseId, "Chapter", "a0"));
        dbContext.Lessons.Add(new Lesson(Guid.NewGuid(), chapterId, courseId, "Lesson", LessonType.Video, "a0"));
        dbContext.SaveChanges();

        GetListLessonsQueryHandler handler = new(readOnlyDbContext, scope.HttpContextAccessor);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.Handle(
            new GetListLessonsQuery
            {
                CourseId = courseId,
                ChapterId = chapterId,
                PageIndex = 1,
                PageSize = 10
            },
            CancellationToken.None));
    }

    private sealed class TestContainer
    {
        public readonly Guid ChapterId = Guid.NewGuid();
        public readonly Guid CourseId = Guid.NewGuid();
        public readonly Guid FirstLessonId = Guid.NewGuid();
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;
        public readonly Guid SecondLessonId = Guid.NewGuid();
        public readonly Guid ThirdLessonId = Guid.NewGuid();

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
                "Backend course",
                "Course",
                60,
                "https://example.com/backend.png",
                true,
                categoryId,
                instructorId));
            dbContext.Chapters.Add(new Chapter(ChapterId, CourseId, "Chapter 1", "a0"));
            dbContext.Enrollments.Add(new Enrollment(Guid.NewGuid(), studentId, CourseId));

            dbContext.Lessons.AddRange(
                new Lesson(ThirdLessonId, ChapterId, CourseId, "Lesson 3", LessonType.Coding, "a1"),
                new Lesson(FirstLessonId, ChapterId, CourseId, "Lesson 1", LessonType.Video, "a0"),
                new Lesson(SecondLessonId, ChapterId, CourseId, "Lesson 2", LessonType.Reading, "a0V"));

            dbContext.SaveChanges();
        }
    }
}