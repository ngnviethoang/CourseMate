using CourseMate.Application.Commands.Chapters;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Tests.Commands.Chapters;

public class DeleteChapterCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldDeleteChapter_WhenInstructorDeletesOwnChapter()
    {
        DeleteChapterCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);

        DeleteChapterCommand request = new() { Id = _testContainer.ChapterId };

        await handler.Handle(request, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();

        Chapter? deleted = await _testContainer.DbContext.Chapters.FirstOrDefaultAsync(c => c.Id == _testContainer.ChapterId);

        Assert.Null(deleted);
    }

    [Fact]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenChapterNotFound()
    {
        DeleteChapterCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);

        DeleteChapterCommand request = new() { Id = Guid.NewGuid() };

        await Assert.ThrowsAsync<EntityNotFoundException>(() => handler.Handle(request, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_ShouldThrowUnauthorizedException_WhenInstructorTriesToDeleteOthersCourse()
    {
        Guid otherInstructorId = Guid.NewGuid();
        TestDbContextScope otherScope = new(otherInstructorId, Roles.Instructor);
        CourseMateDbContext otherDbContext = otherScope.CreateWriteDbContext();

        // Add the chapter/course to the other scope's db with original instructor as owner
        otherDbContext.Courses.Add(new Course(_testContainer.CourseId, "Test Course", "Desc", 99, "https://img.png", true, _testContainer.CategoryId, _testContainer.InstructorId));
        otherDbContext.Chapters.Add(new Chapter(_testContainer.ChapterId, _testContainer.CourseId, "Chapter 1", "a0"));
        await otherDbContext.SaveChangesAsync();

        DeleteChapterCommandHandler handler = new(otherDbContext, otherScope.HttpContextAccessor);

        DeleteChapterCommand request = new() { Id = _testContainer.ChapterId };

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.Handle(request, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_ShouldAllowAdminToDeleteAnyChapter()
    {
        TestDbContextScope adminScope = new(Guid.NewGuid(), Roles.Admin);
        CourseMateDbContext adminDbContext = adminScope.CreateWriteDbContext();

        // Add the chapter/course to the admin scope's db
        adminDbContext.Courses.Add(new Course(_testContainer.CourseId, "Test Course", "Desc", 99, "https://img.png", true, _testContainer.CategoryId, _testContainer.InstructorId));
        adminDbContext.Chapters.Add(new Chapter(_testContainer.ChapterId, _testContainer.CourseId, "Chapter 1", "a0"));
        await adminDbContext.SaveChangesAsync();

        DeleteChapterCommandHandler handler = new(adminDbContext, adminScope.HttpContextAccessor);

        DeleteChapterCommand request = new() { Id = _testContainer.ChapterId };

        await handler.Handle(request, CancellationToken.None);
        await adminDbContext.SaveChangesAsync();

        Chapter? deleted = await adminDbContext.Chapters.FirstOrDefaultAsync(c => c.Id == _testContainer.ChapterId);

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