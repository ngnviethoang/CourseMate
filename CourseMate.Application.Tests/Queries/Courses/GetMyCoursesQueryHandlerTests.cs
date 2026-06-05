using CourseMate.Application.Queries.Courses;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Queries.Courses;

public class GetMyCoursesQueryHandlerTests
{
    [Fact]
    public async Task Handle_ShouldReturnProgressAndLastLesson_WhenStudentHasProgressData()
    {
        TestContainer testContainer = new(Roles.Student);
        GetMyCoursesQueryHandler handler = new(testContainer.ReadOnlyDbContext, testContainer.HttpContextAccessor);
        GetMyCoursesQuery request = new()
        {
            PageIndex = 1,
            PageSize = 10
        };

        PagedDto<StudentMyCourseDto> result = await handler.Handle(request, CancellationToken.None);

        StudentMyCourseDto course = Assert.Single(result.Items);
        Assert.Equal(testContainer.CourseId, course.Id);
        Assert.Equal(2, course.TotalLessons);
        Assert.Equal(1, course.CompletedLessons);
        Assert.Equal(50, course.ProgressPercentage);
        Assert.Equal("Lesson 2", course.LastLessonTitle);
    }

    [Fact]
    public async Task Handle_ShouldUseRequestedStudentId_WhenUserIsAdmin()
    {
        TestContainer testContainer = new(Roles.Admin);
        GetMyCoursesQueryHandler handler = new(testContainer.ReadOnlyDbContext, testContainer.HttpContextAccessor);
        GetMyCoursesQuery request = new()
        {
            StudentId = testContainer.TargetStudentId,
            PageIndex = 1,
            PageSize = 10
        };

        PagedDto<StudentMyCourseDto> result = await handler.Handle(request, CancellationToken.None);

        StudentMyCourseDto course = Assert.Single(result.Items);
        Assert.Equal(testContainer.CourseId, course.Id);
        Assert.Equal("C# Basics", course.Title);
    }

    private sealed class TestContainer
    {
        public readonly Guid CategoryId = Guid.NewGuid();
        public readonly Guid ChapterId = Guid.NewGuid();
        public readonly Guid CourseId = Guid.NewGuid();
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid InstructorId = Guid.NewGuid();
        public readonly Guid Lesson1Id = Guid.NewGuid();
        public readonly Guid Lesson2Id = Guid.NewGuid();
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;
        public readonly Guid TargetStudentId = Guid.NewGuid();

        public TestContainer(string role)
        {
            Guid currentUserId = role == Roles.Admin ? Guid.NewGuid() : TargetStudentId;

            TestDbContextScope testDbContextScope = new(currentUserId, role);
            HttpContextAccessor = testDbContextScope.HttpContextAccessor;
            DbContext = testDbContextScope.CreateWriteDbContext();
            ReadOnlyDbContext = testDbContextScope.CreateReadOnlyDbContext();

            Guid otherStudentId = Guid.NewGuid();

            DbContext.Users.AddRange(
                new User("instructor") { Id = InstructorId, Email = "instructor@example.com" },
                new User("student-a") { Id = TargetStudentId, Email = "student-a@example.com" },
                new User("student-b") { Id = otherStudentId, Email = "student-b@example.com" });

            DbContext.Categories.Add(new Category(CategoryId, "Backend", "Backend category", true));
            DbContext.Courses.Add(new Course(
                CourseId,
                "C# Basics",
                "C# course",
                100,
                "https://example.com/csharp.png",
                true,
                CategoryId,
                InstructorId));
            DbContext.Chapters.Add(new Chapter(ChapterId, CourseId, "Chapter 1", "a0"));
            DbContext.Lessons.AddRange(
                new Lesson(Lesson1Id, ChapterId, CourseId, "Lesson 1", LessonType.Video, "a0"),
                new Lesson(Lesson2Id, ChapterId, CourseId, "Lesson 2", LessonType.Reading, "a1"));
            DbContext.Enrollments.AddRange(
                new Enrollment(Guid.NewGuid(), TargetStudentId, CourseId),
                new Enrollment(Guid.NewGuid(), otherStudentId, CourseId));

            DateTimeOffset now = DateTimeOffset.UtcNow;
            DbContext.UserLessonProgresses.AddRange(
                new UserLessonProgress(Guid.NewGuid(), TargetStudentId, Lesson1Id, true)
                {
                    LastModificationTime = now.AddMinutes(-10)
                },
                new UserLessonProgress(Guid.NewGuid(), TargetStudentId, Lesson2Id, false)
                {
                    LastModificationTime = now
                },
                new UserLessonProgress(Guid.NewGuid(), otherStudentId, Lesson1Id, true)
                {
                    LastModificationTime = now.AddMinutes(-5)
                });

            DbContext.SaveChanges();
        }
    }
}
