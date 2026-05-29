using CourseMate.Application.Commands.Chapters;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Contracts.Shared;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Tests.Commands.Chapters;

public class UpdateChapterCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldMoveChapterAndUpdateTitle_WhenRequestIsValid()
    {
        UpdateChapterAbstractCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);
        UpdateChapterCommand request = new()
        {
            Id = _testContainer.ThirdChapterId,
            CourseId = _testContainer.CourseId,
            Title = "Moved chapter",
            SortOrder = 1
        };

        Unit result = await handler.Handle(request, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();

        Chapter updated = await _testContainer.DbContext.Chapters
            .AsNoTracking()
            .SingleAsync(x => x.Id == _testContainer.ThirdChapterId);

        Chapter first = await _testContainer.DbContext.Chapters
            .AsNoTracking()
            .SingleAsync(x => x.Id == _testContainer.FirstChapterId);
        Chapter second = await _testContainer.DbContext.Chapters
            .AsNoTracking()
            .SingleAsync(x => x.Id == _testContainer.SecondChapterId);

        Assert.Equal(Unit.Value, result);
        Assert.Equal("Moved chapter", updated.Title);
        Assert.Equal(StringFractionalIndexing.GenerateBetween(null, first.Position), updated.Position);
        Assert.True(string.CompareOrdinal(updated.Position, first.Position) < 0);
        Assert.True(string.CompareOrdinal(updated.Position, second.Position) < 0);
    }

    [Fact]
    public async Task Handle_ShouldThrowBusinessException_WhenSortOrderOutOfRange()
    {
        UpdateChapterAbstractCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);
        UpdateChapterCommand request = new()
        {
            Id = _testContainer.FirstChapterId,
            CourseId = _testContainer.CourseId,
            Title = "Invalid update",
            SortOrder = 10
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
        public readonly Guid ThirdChapterId = Guid.NewGuid();

        public TestContainer()
        {
            Guid userId = Guid.NewGuid();
            Guid categoryId = Guid.NewGuid();

            TestDbContextScope scope = new(userId, Roles.Instructor);
            HttpContextAccessor = scope.HttpContextAccessor;
            DbContext = scope.CreateWriteDbContext();

            DbContext.Categories.Add(new Category(categoryId, "Cloud", "Cloud category", true));
            DbContext.Courses.Add(new Course(
                CourseId,
                "Cloud course",
                "Course",
                80,
                "https://example.com/cloud.png",
                true,
                categoryId,
                userId));
            DbContext.Chapters.AddRange(
                new Chapter(FirstChapterId, CourseId, "Chapter 1", "a0"),
                new Chapter(SecondChapterId, CourseId, "Chapter 2", "a1"),
                new Chapter(ThirdChapterId, CourseId, "Chapter 3", "a2"));

            DbContext.SaveChanges();
        }
    }
}