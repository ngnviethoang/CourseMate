using CourseMate.Application.Queries.Exercises;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Queries.Exercises;

public class GetExerciseByIdQueryHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldReturnExercise_WhenAdminQueriesById()
    {
        GetExerciseByIdQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        GetExerciseByIdQuery query = new() { Id = _testContainer.ExerciseId };

        GetExerciseByIdResponse? result = await handler.Handle(query, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(_testContainer.ExerciseId, result.Id);
        Assert.Equal("Test Exercise", result.Title);
    }

    [Fact]
    public async Task Handle_ShouldReturnNullForHiddenExercise_WhenStudentQueries()
    {
        TestDbContextScope studentScope = new(Guid.NewGuid(), Roles.Student);
        CourseMateDbContext studentDbContext = studentScope.CreateWriteDbContext();

        studentDbContext.Users.Add(new User("creator") { Id = _testContainer.CreatorId, Email = "creator@test.com" });
        studentDbContext.Exercises.Add(new Exercise(
            _testContainer.HiddenExerciseId, "Hidden Exercise", "desc", ExerciseDifficultyType.Hard, "Graph", _testContainer.CreatorId,
            new List<string>(), new List<string>()) { IsHidden = true });
        await studentDbContext.SaveChangesAsync();

        GetExerciseByIdQueryHandler handler = new(studentScope.CreateReadOnlyDbContext(), studentScope.HttpContextAccessor);

        GetExerciseByIdQuery query = new() { Id = _testContainer.HiddenExerciseId };

        GetExerciseByIdResponse? result = await handler.Handle(query, CancellationToken.None);

        Assert.Null(result);
    }

    [Fact]
    public async Task Handle_ShouldReturnNull_WhenExerciseNotFound()
    {
        GetExerciseByIdQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        GetExerciseByIdQuery query = new() { Id = Guid.NewGuid() };

        GetExerciseByIdResponse? result = await handler.Handle(query, CancellationToken.None);

        Assert.Null(result);
    }

    [Fact]
    public async Task Handle_ShouldReturnExerciseWithTestCasesAndExamples_WhenAdminQueries()
    {
        GetExerciseByIdQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        GetExerciseByIdQuery query = new() { Id = _testContainer.ExerciseId };

        GetExerciseByIdResponse? result = await handler.Handle(query, CancellationToken.None);

        Assert.NotNull(result);
        Assert.NotEmpty(result.TestCases);
        Assert.NotEmpty(result.Examples);
        Assert.Equal(1, result.TestCaseCount);
    }

    [Fact]
    public async Task Handle_ShouldReturnHiddenExercise_WhenInstructorQueries()
    {
        TestDbContextScope instructorScope = new(_testContainer.CreatorId, Roles.Instructor);
        CourseMateDbContext instructorDbContext = instructorScope.CreateWriteDbContext();

        instructorDbContext.Users.Add(new User("creator") { Id = _testContainer.CreatorId, Email = "creator@test.com" });
        instructorDbContext.Exercises.Add(new Exercise(
            _testContainer.HiddenExerciseId, "Hidden Exercise", "desc", ExerciseDifficultyType.Hard, "Graph", _testContainer.CreatorId,
            new List<string>(), new List<string>()) { IsHidden = true });
        await instructorDbContext.SaveChangesAsync();

        GetExerciseByIdQueryHandler handler = new(instructorScope.CreateReadOnlyDbContext(), instructorScope.HttpContextAccessor);

        GetExerciseByIdQuery query = new() { Id = _testContainer.HiddenExerciseId };

        GetExerciseByIdResponse? result = await handler.Handle(query, CancellationToken.None);

        // Instructor (not Student) should see hidden exercise
        Assert.NotNull(result);
    }

    private sealed class TestContainer
    {
        public readonly Guid CreatorId = Guid.NewGuid();
        public readonly Guid ExerciseId = Guid.NewGuid();
        public readonly Guid HiddenExerciseId = Guid.NewGuid();
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;

        public TestContainer()
        {
            TestDbContextScope scope = new(Guid.NewGuid(), Roles.Admin);
            HttpContextAccessor = scope.HttpContextAccessor;
            CourseMateDbContext dbContext = scope.CreateWriteDbContext();
            ReadOnlyDbContext = scope.CreateReadOnlyDbContext();

            dbContext.Users.Add(new User("creator") { Id = CreatorId, Email = "creator@example.com" });
            dbContext.Exercises.Add(new Exercise(
                    ExerciseId, "Test Exercise", "A test exercise", ExerciseDifficultyType.Easy, "Arrays", CreatorId,
                    new List<string> { "1 <= n <= 100" }, new List<string> { "Try a brute force first" })
                { IsHidden = false });

            dbContext.ExerciseTestCases.Add(new ExerciseTestCase(
                Guid.NewGuid(), ExerciseId, "[1,2,3]", "6", "Sum of array", false, 1));
            dbContext.ExerciseExamples.Add(new ExerciseExample(
                Guid.NewGuid(), ExerciseId, "[1,2,3]", "6", "Sum is 6"));
            dbContext.ExerciseDefaultCodes.Add(new ExerciseDefaultCode(
                Guid.NewGuid(), ExerciseId, "python", "def solution(nums): pass"));

            dbContext.SaveChanges();
        }
    }
}