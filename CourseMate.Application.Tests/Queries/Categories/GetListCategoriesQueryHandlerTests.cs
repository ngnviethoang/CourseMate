using CourseMate.Application.Queries.Categories;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Queries.Categories;

public class GetListCategoriesQueryHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldReturnOnlyCategoriesThatHaveCourses_WhenHasCourseIsTrue()
    {
        Guid categoryWithTwoCourses = _testContainer.CategoryWithTwoCoursesId;
        Guid categoryWithOneCourse = _testContainer.CategoryWithOneCourseId;
        GetListCategoryQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        GetListCategoriesQuery request = new()
        {
            HasCourse = true,
            PageIndex = 1,
            PageSize = 10
        };

        PagedDto<CategoryDto> result = await handler.Handle(request, CancellationToken.None);

        Assert.Equal(2, result.Items.Count());
        Assert.Contains(result.Items, x => x.Id == categoryWithTwoCourses && x.CourseCount == 2);
        Assert.Contains(result.Items, x => x.Id == categoryWithOneCourse && x.CourseCount == 1);
        Assert.DoesNotContain(result.Items, x => x.CourseCount == 0);
    }

    [Fact]
    public async Task Handle_ShouldSortByCourseCountDescending_WhenSortingIsCourseCountDesc()
    {
        Guid categoryA = _testContainer.CategoryWithTwoCoursesId;
        Guid categoryB = _testContainer.CategoryWithOneCourseId;
        Guid categoryC = _testContainer.CategoryWithoutCourseId;
        GetListCategoryQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        GetListCategoriesQuery request = new()
        {
            Sorting = "courseCount_desc",
            PageIndex = 1,
            PageSize = 10
        };

        PagedDto<CategoryDto> result = await handler.Handle(request, CancellationToken.None);

        Assert.Equal(3, result.Items.Count());
        Assert.Equal(categoryA, result.Items.ElementAt(0).Id);
        Assert.Equal(categoryB, result.Items.ElementAt(1).Id);
        Assert.Equal(categoryC, result.Items.ElementAt(2).Id);
        Assert.Equal(2, result.Items.ElementAt(0).CourseCount);
        Assert.Equal(1, result.Items.ElementAt(1).CourseCount);
        Assert.Equal(0, result.Items.ElementAt(2).CourseCount);
    }

    private sealed class TestContainer
    {
        public readonly Guid CategoryWithOneCourseId = Guid.NewGuid();
        public readonly Guid CategoryWithoutCourseId = Guid.NewGuid();
        public readonly Guid CategoryWithTwoCoursesId = Guid.NewGuid();
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;
        public readonly Guid UserId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope testDbContextScope = new(UserId, Roles.Admin);
            HttpContextAccessor = testDbContextScope.HttpContextAccessor;
            DbContext = testDbContextScope.CreateWriteDbContext();
            ReadOnlyDbContext = testDbContextScope.CreateReadOnlyDbContext();
            DbContext.Categories.AddRange(
                new Category(CategoryWithTwoCoursesId, "Backend", "Backend path", true),
                new Category(CategoryWithOneCourseId, "Design", "Design path", true),
                new Category(CategoryWithoutCourseId, "No Course", "No course category", true));
            DbContext.Courses.AddRange(
                new Course(
                    Guid.NewGuid(),
                    "C# Master",
                    "C#",
                    10,
                    "image-url",
                    true,
                    CategoryWithTwoCoursesId,
                    Guid.NewGuid()),
                new Course(
                    Guid.NewGuid(),
                    "SQL Deep Dive",
                    "SQL",
                    10,
                    "image-url",
                    true,
                    CategoryWithTwoCoursesId,
                    Guid.NewGuid()),
                new Course(
                    Guid.NewGuid(),
                    "Figma Basics",
                    "Figma",
                    10,
                    "image-url",
                    true,
                    CategoryWithOneCourseId,
                    Guid.NewGuid()));
            DbContext.SaveChanges();
        }
    }
}