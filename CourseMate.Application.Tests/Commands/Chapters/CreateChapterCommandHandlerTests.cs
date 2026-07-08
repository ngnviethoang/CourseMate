using CourseMate.Application.Commands.Chapters;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Tests.Commands.Chapters;

public class CreateChapterCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldInsertChapterAtRequestedSortOrder()
    {
        CreateChapterCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);
        CreateChapterCommand request = new()
        {
            CourseId = _testContainer.CourseId,
            Title = "Inserted chapter",
            SortOrder = 2
        };

        ResultIdDto result = await handler.Handle(request, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();

        Chapter? created = await _testContainer.DbContext.Chapters
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == result.Id);

        Assert.NotNull(created);
        Assert.Equal(request.Title, created.Title);

        List<Guid> orderedChapterIds = await _testContainer.DbContext.Chapters
            .Where(x => x.CourseId == _testContainer.CourseId)
            .OrderBy(x => x.Position)
            .Select(x => x.Id)
            .ToListAsync();

        Assert.Equal(
            [_testContainer.FirstChapterId, result.Id, _testContainer.SecondChapterId],
            orderedChapterIds);
    }

    [Fact]
    public async Task Handle_ShouldThrowBusinessException_WhenSortOrderOutOfRange()
    {
        CreateChapterCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);
        CreateChapterCommand request = new()
        {
            CourseId = _testContainer.CourseId,
            Title = "Invalid chapter",
            SortOrder = 5
        };

        BusinessException exception = await Assert.ThrowsAsync<BusinessException>(() => handler.Handle(request, CancellationToken.None));
        Assert.Equal(ErrorCode.PositionOutOfRange, exception.ErrorCode);
    }

    private sealed class TestContainer
    {
        public readonly Guid CourseId = Guid.NewGuid();
        public readonly CourseMateDbContext DbContext;
        public readonly Guid FirstChapterId = Guid.NewGuid();
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid SecondChapterId = Guid.NewGuid();

        public TestContainer()
        {
            Guid userId = Guid.NewGuid();
            Guid categoryId = Guid.NewGuid();

            TestDbContextScope scope = new(userId, Roles.Instructor);
            HttpContextAccessor = scope.HttpContextAccessor;
            DbContext = scope.CreateWriteDbContext();

            DbContext.Categories.Add(new Category(categoryId, "Data", "Data category", true));
            DbContext.Courses.Add(new Course(
                CourseId,
                "Data course",
                "Course",
                90,
                "https://example.com/data.png",
                true,
                categoryId,
                userId));
            DbContext.Chapters.AddRange(
                new Chapter(FirstChapterId, CourseId, "Chapter 1", "a0"),
                new Chapter(SecondChapterId, CourseId, "Chapter 2", "a1"));

            DbContext.SaveChanges();
        }
    }
}