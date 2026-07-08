using CourseMate.Application.Queries.Exercises;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Queries.Exercises;

public class GetListExercisesQueryHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldReturnAllExercises_WhenAdminQueriesAll()
    {
        GetListExercisesQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        GetListExercisesQuery query = new();

        PagedDto<ExerciseDto> result = await handler.Handle(query, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(2, result.TotalCount);
    }

    [Fact]
    public async Task Handle_ShouldExcludeHiddenExercises_WhenStudentQueriesExercises()
    {
        TestDbContextScope studentScope = new(Guid.NewGuid(), Roles.Student);
        CourseMateDbContext studentDbContext = studentScope.CreateWriteDbContext();

        studentDbContext.Users.Add(new User("creator") { Id = _testContainer.CreatorId, Email = "creator@test.com" });
        studentDbContext.Exercises.Add(new Exercise(
            _testContainer.VisibleExerciseId, "Visible Exercise", "desc", ExerciseDifficultyType.Easy, "Algorithms", _testContainer.CreatorId,
            new List<string>(), new List<string>()) { IsHidden = false });
        studentDbContext.Exercises.Add(new Exercise(
            Guid.NewGuid(), "Hidden Exercise", "desc", ExerciseDifficultyType.Easy, "Algorithms", _testContainer.CreatorId,
            new List<string>(), new List<string>()) { IsHidden = true });
        await studentDbContext.SaveChangesAsync();

        GetListExercisesQueryHandler handler = new(studentScope.CreateReadOnlyDbContext(), studentScope.HttpContextAccessor);

        GetListExercisesQuery query = new();

        PagedDto<ExerciseDto> result = await handler.Handle(query, CancellationToken.None);

        Assert.NotNull(result);
        Assert.All(result.Items, e => Assert.False(e.IsHidden));
    }

    [Fact]
    public async Task Handle_ShouldOnlyReturnOwnExercises_WhenInstructorQueriesExercises()
    {
        TestDbContextScope instructorScope = new(_testContainer.CreatorId, Roles.Instructor);
        CourseMateDbContext instructorDbContext = instructorScope.CreateWriteDbContext();

        Guid otherId = Guid.NewGuid();
        instructorDbContext.Users.Add(new User("creator") { Id = _testContainer.CreatorId, Email = "creator@test.com" });
        instructorDbContext.Users.Add(new User("other") { Id = otherId, Email = "other@test.com" });
        instructorDbContext.Exercises.Add(new Exercise(
            _testContainer.VisibleExerciseId, "My Exercise", "desc", ExerciseDifficultyType.Easy, "Algorithms", _testContainer.CreatorId,
            new List<string>(), new List<string>()));
        instructorDbContext.Exercises.Add(new Exercise(
            Guid.NewGuid(), "Other Instructor Exercise", "desc", ExerciseDifficultyType.Medium, "DP", otherId,
            new List<string>(), new List<string>()));
        await instructorDbContext.SaveChangesAsync();

        GetListExercisesQueryHandler handler = new(instructorScope.CreateReadOnlyDbContext(), instructorScope.HttpContextAccessor);

        GetListExercisesQuery query = new();

        PagedDto<ExerciseDto> result = await handler.Handle(query, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Single(result.Items);
        Assert.Equal(_testContainer.CreatorId, result.Items.First().CreatedById);
    }

    [Fact]
    public async Task Handle_ShouldReturnExerciseFilteredById_WhenFilterIsGuid()
    {
        GetListExercisesQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        GetListExercisesQuery query = new() { Filter = _testContainer.VisibleExerciseId.ToString() };

        PagedDto<ExerciseDto> result = await handler.Handle(query, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Single(result.Items);
        Assert.Equal(_testContainer.VisibleExerciseId, result.Items.First().Id);
    }

    private sealed class TestContainer
    {
        public readonly Guid CreatorId = Guid.NewGuid();
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;
        public readonly Guid VisibleExerciseId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope scope = new(Guid.NewGuid(), Roles.Admin);
            HttpContextAccessor = scope.HttpContextAccessor;
            CourseMateDbContext dbContext = scope.CreateWriteDbContext();
            ReadOnlyDbContext = scope.CreateReadOnlyDbContext();

            dbContext.Users.Add(new User("creator") { Id = CreatorId, Email = "creator@example.com" });
            dbContext.Exercises.Add(new Exercise(
                    VisibleExerciseId, "Exercise One", "Easy sorting problem", ExerciseDifficultyType.Easy, "Sorting", CreatorId,
                    new List<string> { "1 <= n <= 1000" }, new List<string> { "Think about simple loops" })
                { IsHidden = false });
            dbContext.Exercises.Add(new Exercise(
                    Guid.NewGuid(), "Exercise Two (Hidden)", "Hard DP problem", ExerciseDifficultyType.Hard, "Dynamic Programming", CreatorId,
                    new List<string>(), new List<string>())
                { IsHidden = true });

            dbContext.SaveChanges();
        }
    }
}