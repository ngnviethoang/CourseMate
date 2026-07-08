using CourseMate.Application.Queries.Recommendations;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Recommendations;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Moq;

namespace CourseMate.Application.Tests.Queries.Recommendations;

public class GetMyRecommendationsQueryHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldReturnPersonalizedRecommendationsOrderedByRank_WhenUserHasRecommendations()
    {
        GetMyRecommendationsQueryHandler handler = new(
            _testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor, _testContainer.Sender.Object);

        List<RecommendedCourseDto> result = await handler.Handle(new GetMyRecommendationsQuery { Limit = 10 }, CancellationToken.None);

        Assert.Equal(_testContainer.Rank1CourseId, result[0].Id);
        Assert.Equal(_testContainer.Rank2CourseId, result[1].Id);
        Assert.All(result, course => Assert.Equal(RecommendationReason.Personalized, course.Reason));
        _testContainer.Sender.Verify(s => s.Send(It.IsAny<GetTrendingCoursesQuery>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Handle_ShouldFallBackToTrending_WhenUserHasNoRecommendations()
    {
        TestContainer container = new(false);
        List<RecommendedCourseDto> trending =
        [
            new()
                { Id = Guid.NewGuid(), Reason = RecommendationReason.Popular }
        ];
        container.Sender
            .Setup(s => s.Send(It.IsAny<GetTrendingCoursesQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(trending);
        GetMyRecommendationsQueryHandler handler = new(
            container.ReadOnlyDbContext, container.HttpContextAccessor, container.Sender.Object);

        List<RecommendedCourseDto> result = await handler.Handle(new GetMyRecommendationsQuery { Limit = 10 }, CancellationToken.None);

        Assert.Single(result);
        Assert.Equal(RecommendationReason.Popular, result[0].Reason);
        container.Sender.Verify(s => s.Send(It.IsAny<GetTrendingCoursesQuery>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    private sealed class TestContainer
    {
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid Rank1CourseId = Guid.NewGuid();
        public readonly Guid Rank2CourseId = Guid.NewGuid();
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;
        public readonly Mock<ISender> Sender = new();
        public readonly Guid UserId = Guid.NewGuid();

        public TestContainer(bool seedRecommendations = true)
        {
            TestDbContextScope scope = new(UserId, Roles.Student);
            HttpContextAccessor = scope.HttpContextAccessor;
            DbContext = scope.CreateWriteDbContext();
            ReadOnlyDbContext = scope.CreateReadOnlyDbContext();

            Guid categoryId = Guid.NewGuid();
            DbContext.Categories.Add(new Category(categoryId, "Backend", "Backend path", true));
            DbContext.Courses.AddRange(
                new Course(Rank1CourseId, "First", "desc", 10, "img", true, categoryId, Guid.NewGuid()),
                new Course(Rank2CourseId, "Second", "desc", 10, "img", true, categoryId, Guid.NewGuid()));

            if (seedRecommendations)
            {
                DbContext.UserRecommendations.AddRange(
                    new UserRecommendation(Guid.NewGuid(), UserId, Rank2CourseId, 0.7, 2, DateTimeOffset.UtcNow),
                    new UserRecommendation(Guid.NewGuid(), UserId, Rank1CourseId, 0.9, 1, DateTimeOffset.UtcNow));
            }

            DbContext.SaveChanges();
        }
    }
}