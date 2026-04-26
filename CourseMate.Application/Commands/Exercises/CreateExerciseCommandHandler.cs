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

public class UpsertExampleDto
{
    public string Input { get; set; } = string.Empty;
    public string Output { get; set; } = string.Empty;
    public string? Explanation { get; set; }
}

public class UpsertTestCaseDto
{
    public Guid? Id { get; set; }
    public string Input { get; set; } = string.Empty;
    public string ExpectedOutput { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsHidden { get; set; }
    public int Order { get; set; }
}

public class UpsertDefaultCodeDto
{
    public Guid? Id { get; set; }
    public string Language { get; set; } = string.Empty;
    public string StarterCode { get; set; } = string.Empty;
}

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

    public List<UpsertExampleDto> Examples { get; set; } = [];
    public List<string> Constraints { get; set; } = [];
    public List<string> Hints { get; set; } = [];

    public List<UpsertTestCaseDto> TestCases { get; set; } = [];
    public List<UpsertDefaultCodeDto> DefaultCodes { get; set; } = [];
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
            CurrentUserId
        );

        exercise.Examples = request.Examples.Select(e => new ExerciseExample
        {
            Input = e.Input,
            Output = e.Output,
            Explanation = e.Explanation
        }).ToList();
        exercise.Constraints = request.Constraints;
        exercise.Hints = request.Hints;

        // Test cases
        int order = 0;
        foreach (UpsertTestCaseDto tc in request.TestCases)
        {
            exercise.TestCases.Add(new ExerciseTestCase(
                Guid.NewGuid(),
                exercise.Id,
                tc.Input,
                tc.ExpectedOutput,
                tc.Description,
                tc.IsHidden,
                tc.Order > 0 ? tc.Order : order++
            ));
        }

        // Default codes
        foreach (UpsertDefaultCodeDto dc in request.DefaultCodes)
        {
            exercise.DefaultCodes.Add(new ExerciseDefaultCode(
                Guid.NewGuid(),
                exercise.Id,
                dc.Language,
                dc.StarterCode
            ));
        }

        await DbContext.Exercises.AddAsync(exercise, cancellationToken);
        await DbContext.SaveChangesAsync(cancellationToken);
        return new ResultIdDto { Id = exercise.Id };
    }
}