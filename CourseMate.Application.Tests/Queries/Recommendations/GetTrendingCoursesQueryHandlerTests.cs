using CourseMate.Application.Queries.Recommendations;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Recommendations;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Queries.Recommendations;

public class GetTrendingCoursesQueryHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldRankByEnrollmentCountDescending_WhenCoursesHaveEnrollments()
    {
        GetTrendingCoursesQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        List<RecommendedCourseDto> result = await handler.Handle(new GetTrendingCoursesQuery { Limit = 10 }, CancellationToken.None);

        Assert.Equal(_testContainer.PopularCourseId, result[0].Id);
        Assert.Equal(_testContainer.LessPopularCourseId, result[1].Id);
        Assert.All(result, course => Assert.Equal(RecommendationReason.Popular, course.Reason));
    }

    [Fact]
    public async Task Handle_ShouldExcludeUnpublishedCourses_WhenQuerying()
    {
        GetTrendingCoursesQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        List<RecommendedCourseDto> result = await handler.Handle(new GetTrendingCoursesQuery { Limit = 10 }, CancellationToken.None);

        Assert.DoesNotContain(result, course => course.Id == _testContainer.UnpublishedCourseId);
    }

    [Fact]
    public async Task Handle_ShouldRespectLimit_WhenLimitIsSmallerThanCourseCount()
    {
        GetTrendingCoursesQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        List<RecommendedCourseDto> result = await handler.Handle(new GetTrendingCoursesQuery { Limit = 1 }, CancellationToken.None);

        Assert.Single(result);
        Assert.Equal(_testContainer.PopularCourseId, result[0].Id);
    }

    private sealed class TestContainer
    {
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid LessPopularCourseId = Guid.NewGuid();
        public readonly Guid PopularCourseId = Guid.NewGuid();
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;
        public readonly Guid UnpublishedCourseId = Guid.NewGuid();
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
                new Course(PopularCourseId, "Popular", "desc", 10, "img", true, categoryId, Guid.NewGuid()),
                new Course(LessPopularCourseId, "Less popular", "desc", 10, "img", true, categoryId, Guid.NewGuid()),
                new Course(UnpublishedCourseId, "Hidden", "desc", 10, "img", false, categoryId, Guid.NewGuid()));

            DbContext.Enrollments.AddRange(
                new Enrollment(Guid.NewGuid(), Guid.NewGuid(), PopularCourseId),
                new Enrollment(Guid.NewGuid(), Guid.NewGuid(), PopularCourseId),
                new Enrollment(Guid.NewGuid(), Guid.NewGuid(), PopularCourseId),
                new Enrollment(Guid.NewGuid(), Guid.NewGuid(), LessPopularCourseId),
                new Enrollment(Guid.NewGuid(), Guid.NewGuid(), UnpublishedCourseId));
            DbContext.SaveChanges();
        }
    }
}
