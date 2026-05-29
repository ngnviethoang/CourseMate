using CourseMate.Application.Queries.Courses;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Queries.Courses;

public class GetCourseByIdQueryHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldReturnOrderedOutlineAndProgress_WhenStudentCanViewCourse()
    {
        GetCourseByIdQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        CourseDetailDto? result = await handler.Handle(
            new GetCourseByIdQuery { Id = _testContainer.PublishedCourseId },
            CancellationToken.None);

        Assert.NotNull(result);
        Assert.True(result.IsEnrolled);
        Assert.Equal(2, result.Chapters.Count);

        ChapterDetailDto firstChapter = result.Chapters[0];
        ChapterDetailDto secondChapter = result.Chapters[1];
        Assert.Equal(_testContainer.FirstChapterId, firstChapter.Id);
        Assert.Equal(1, firstChapter.SortOrder);
        Assert.Equal(_testContainer.SecondChapterId, secondChapter.Id);
        Assert.Equal(2, secondChapter.SortOrder);

        Assert.Equal(2, firstChapter.Lessons.Count);
        Assert.Equal(_testContainer.FirstLessonId, firstChapter.Lessons[0].Id);
        Assert.Equal(1, firstChapter.Lessons[0].SortOrder);
        Assert.True(firstChapter.Lessons[0].IsCompleted);
        Assert.Equal(_testContainer.SecondLessonId, firstChapter.Lessons[1].Id);
        Assert.Equal(2, firstChapter.Lessons[1].SortOrder);
        Assert.False(firstChapter.Lessons[1].IsCompleted);

        Assert.Single(secondChapter.Lessons);
        Assert.Equal(_testContainer.ThirdLessonId, secondChapter.Lessons[0].Id);
        Assert.Equal(1, secondChapter.Lessons[0].SortOrder);

        Assert.Equal(33.33, result.ProgressPercentage, 2);
    }

    [Fact]
    public async Task Handle_ShouldReturnNull_WhenStudentQueriesUnpublishedCourse()
    {
        GetCourseByIdQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        CourseDetailDto? result = await handler.Handle(
            new GetCourseByIdQuery { Id = _testContainer.UnpublishedCourseId },
            CancellationToken.None);

        Assert.Null(result);
    }

    private sealed class TestContainer
    {
        public readonly Guid FirstChapterId = Guid.NewGuid();
        public readonly Guid FirstLessonId = Guid.NewGuid();
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid PublishedCourseId = Guid.NewGuid();
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;
        public readonly Guid SecondChapterId = Guid.NewGuid();
        public readonly Guid SecondLessonId = Guid.NewGuid();
        public readonly Guid ThirdLessonId = Guid.NewGuid();
        public readonly Guid UnpublishedCourseId = Guid.NewGuid();

        public TestContainer()
        {
            Guid studentId = Guid.NewGuid();
            Guid instructorId = Guid.NewGuid();
            Guid categoryId = Guid.NewGuid();

            TestDbContextScope scope = new(studentId, Roles.Student);
            HttpContextAccessor = scope.HttpContextAccessor;
            CourseMateDbContext dbContext = scope.CreateWriteDbContext();
            ReadOnlyDbContext = scope.CreateReadOnlyDbContext();

            dbContext.Users.AddRange(
                new User("student") { Id = studentId, Email = "student@example.com" },
                new User("instructor") { Id = instructorId, Email = "instructor@example.com" });

            dbContext.Categories.Add(new Category(categoryId, "Backend", "Backend category", true));

            dbContext.Courses.AddRange(
                new Course(
                    PublishedCourseId,
                    "Published course",
                    "Visible course",
                    99,
                    "https://example.com/course.png",
                    true,
                    categoryId,
                    instructorId),
                new Course(
                    UnpublishedCourseId,
                    "Draft course",
                    "Hidden course",
                    120,
                    "https://example.com/draft.png",
                    false,
                    categoryId,
                    instructorId));

            dbContext.Enrollments.Add(new Enrollment(Guid.NewGuid(), studentId, PublishedCourseId));

            dbContext.Chapters.AddRange(
                new Chapter(SecondChapterId, PublishedCourseId, "Second chapter", "a1"),
                new Chapter(FirstChapterId, PublishedCourseId, "First chapter", "a0"));

            dbContext.Lessons.AddRange(
                new Lesson(SecondLessonId, FirstChapterId, PublishedCourseId, "Lesson B", LessonType.Reading, "a1"),
                new Lesson(FirstLessonId, FirstChapterId, PublishedCourseId, "Lesson A", LessonType.Video, "a0"),
                new Lesson(ThirdLessonId, SecondChapterId, PublishedCourseId, "Lesson C", LessonType.Coding, "a0"));

            dbContext.UserLessonProgresses.Add(
                new UserLessonProgress(Guid.NewGuid(), studentId, FirstLessonId, true, 10));

            dbContext.SaveChanges();
        }
    }
}