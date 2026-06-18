using CourseMate.Application.Queries.Recommendations;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Recommendations;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Queries.Recommendations;

public class GetSimilarCoursesQueryHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldOrderBySimilarityScoreDescending_WhenSimilaritiesExist()
    {
        GetSimilarCoursesQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        List<RecommendedCourseDto> result = await handler.Handle(
            new GetSimilarCoursesQuery { CourseId = _testContainer.AnchorCourseId, Limit = 10 }, CancellationToken.None);

        Assert.Equal(_testContainer.HighScoreCourseId, result[0].Id);
        Assert.Equal(_testContainer.LowScoreCourseId, result[1].Id);
        Assert.All(result, course => Assert.Equal(RecommendationReason.SimilarContent, course.Reason));
    }

    [Fact]
    public async Task Handle_ShouldExcludeUnpublishedSimilarCourses_WhenQuerying()
    {
        GetSimilarCoursesQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        List<RecommendedCourseDto> result = await handler.Handle(
            new GetSimilarCoursesQuery { CourseId = _testContainer.AnchorCourseId, Limit = 10 }, CancellationToken.None);

        Assert.DoesNotContain(result, course => course.Id == _testContainer.UnpublishedSimilarId);
    }

    [Fact]
    public async Task Handle_ShouldReturnEmpty_WhenCourseHasNoSimilarities()
    {
        GetSimilarCoursesQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        List<RecommendedCourseDto> result = await handler.Handle(
            new GetSimilarCoursesQuery { CourseId = Guid.NewGuid(), Limit = 10 }, CancellationToken.None);

        Assert.Empty(result);
    }

    private sealed class TestContainer
    {
        public readonly Guid AnchorCourseId = Guid.NewGuid();
        public readonly CourseMateDbContext DbContext;
        public readonly Guid HighScoreCourseId = Guid.NewGuid();
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid LowScoreCourseId = Guid.NewGuid();
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;
        public readonly Guid UnpublishedSimilarId = Guid.NewGuid();
        public readonly Guid UserId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope scope = new(UserId, Roles.Student);
            HttpContextAccessor = scope.HttpContextAccessor;
            DbContext = scope.CreateWriteDbContext();
            ReadOnlyDbContext = scope.CreateReadOnlyDbContext();

            Guid categoryId = Guid.NewGuid();
            DbContext.Categories.Add(new Category(categoryId, "Backend", "Backend path", true));
            DbContext.Courses.AddRange(
                new Course(AnchorCourseId, "Anchor", "desc", 10, "img", true, categoryId, Guid.NewGuid()),
                new Course(HighScoreCourseId, "High", "desc", 10, "img", true, categoryId, Guid.NewGuid()),
                new Course(LowScoreCourseId, "Low", "desc", 10, "img", true, categoryId, Guid.NewGuid()),
                new Course(UnpublishedSimilarId, "Hidden", "desc", 10, "img", false, categoryId, Guid.NewGuid()));

            DbContext.CourseSimilarities.AddRange(
                new CourseSimilarity(Guid.NewGuid(), AnchorCourseId, HighScoreCourseId, 0.9),
                new CourseSimilarity(Guid.NewGuid(), AnchorCourseId, LowScoreCourseId, 0.4),
                new CourseSimilarity(Guid.NewGuid(), AnchorCourseId, UnpublishedSimilarId, 0.95));
            DbContext.SaveChanges();
        }
    }
}
