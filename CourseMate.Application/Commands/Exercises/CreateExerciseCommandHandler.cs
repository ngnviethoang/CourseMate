using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Shared;
using CourseMate.Contracts;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Exercises;

public class CreateExerciseCommand : IRequest<ResultIdDto>
{
    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(CourseMateConsts.DescriptionMaxLength)]
    public string Description { get; set; } = string.Empty;

    /// <summary>Easy | Medium | Hard</summary>
    public string Difficulty { get; set; } = "Easy";

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Category { get; set; } = string.Empty;

    public IEnumerable<string> Constraints { get; set; } = [];

    public IEnumerable<string> Hints { get; set; } = [];

    public IEnumerable<CreateExerciseExampleRequest> Examples { get; set; } = [];

    public IEnumerable<CreateExerciseTestCaseRequest> TestCases { get; set; } = [];

    public IEnumerable<CreateExerciseDefaultCodeRequest> DefaultCodes { get; set; } = [];

    public class CreateExerciseTestCaseRequest
    {
        [MaxLength(CourseMateConsts.DefaultMaxLength)]
        public string Input { get; set; } = string.Empty;

        [MaxLength(CourseMateConsts.DefaultMaxLength)]
        public string ExpectedOutput { get; set; } = string.Empty;

        [MaxLength(CourseMateConsts.DefaultMaxLength)]
        public string Description { get; set; } = string.Empty;

        public bool IsHidden { get; set; }

        [Range(0, int.MaxValue)]
        public int Order { get; set; }
    }

    public class CreateExerciseExampleRequest
    {
        [MaxLength(CourseMateConsts.DefaultMaxLength)]
        public string Input { get; set; } = string.Empty;

        [MaxLength(CourseMateConsts.DefaultMaxLength)]
        public string Output { get; set; } = string.Empty;

        [MaxLength(CourseMateConsts.ContentMaxLength)]
        public string Explanation { get; set; } = string.Empty;
    }

    public class CreateExerciseDefaultCodeRequest
    {
        [MaxLength(CourseMateConsts.DefaultMaxLength)]
        public string Language { get; set; } = string.Empty;

        [MaxLength(CourseMateConsts.ContentMaxLength)]
        public string StarterCode { get; set; } = string.Empty;
    }
}

internal sealed class CreateExerciseCommandHandler : AbstractCommandHandler<CreateExerciseCommand, ResultIdDto>
{
    public CreateExerciseCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(CreateExerciseCommand request, CancellationToken cancellationToken)
    {
        ExerciseDifficultyType difficultyType = Enum.TryParse(request.Difficulty, true, out ExerciseDifficultyType d) ? d : ExerciseDifficultyType.Easy;

        Exercise exercise = new(
            Guid.NewGuid(),
            request.Title,
            request.Description,
            difficultyType,
            request.Category,
            CurrentUserId,
            request.Constraints.ToList(),
            request.Hints.ToList()
        );
        await DbContext.Exercises.AddAsync(exercise, cancellationToken);

        IEnumerable<ExerciseExample> exerciseExamples = request.Examples
            .Select(e => new ExerciseExample(
                Guid.NewGuid(),
                exercise.Id,
                e.Input,
                e.Output,
                e.Explanation));
        await DbContext.ExerciseExamples.AddRangeAsync(exerciseExamples, cancellationToken);

        IEnumerable<ExerciseTestCase> testCases = request.TestCases
            .Select(tc => new ExerciseTestCase(
                Guid.NewGuid(),
                exercise.Id,
                tc.Input,
                tc.ExpectedOutput,
                tc.Description,
                tc.IsHidden,
                tc.Order));
        await DbContext.ExerciseTestCases.AddRangeAsync(testCases, cancellationToken);

        IEnumerable<ExerciseDefaultCode> exerciseDefaultCodes = request.DefaultCodes
            .Select(x => new ExerciseDefaultCode(
                Guid.NewGuid(),
                exercise.Id,
                x.Language,
                x.StarterCode));
        await DbContext.ExerciseDefaultCodes.AddRangeAsync(exerciseDefaultCodes, cancellationToken);

        await DbContext.SaveChangesAsync(cancellationToken);
        return new ResultIdDto { Id = exercise.Id };
    }
}