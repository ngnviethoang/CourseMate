using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Shared;
using CourseMate.Contracts;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Exercises;

public class UpdateExerciseCommand : IRequest<int>
{
    public Guid Id { get; set; }

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

internal sealed class UpdateExerciseCommandHandler : AbstractCommandHandler<UpdateExerciseCommand, int>
{
    public UpdateExerciseCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(UpdateExerciseCommand request, CancellationToken ct)
    {
        Exercise? exercise = await DbContext.Exercises
            .WhereIf(IsInRole(Roles.Instructor), x => x.CreatorId == CurrentUserId)
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (exercise is null)
        {
            throw new EntityNotFoundException(nameof(Exercise), request.Id);
        }

        ExerciseDifficultyType difficultyType = Enum.TryParse(request.Difficulty, true, out ExerciseDifficultyType d) ? d : ExerciseDifficultyType.Easy;

        exercise.Title = request.Title;
        exercise.Description = request.Description;
        exercise.Difficulty = difficultyType;
        exercise.Category = request.Category;
        exercise.Constraints = request.Constraints.ToList();
        exercise.Hints = request.Hints.ToList();
        DbContext.Exercises.Update(exercise);

        List<ExerciseExample> oldExerciseExamples = await DbContext.ExerciseExamples.Where(x => x.ExerciseId == exercise.Id).ToListAsync(ct);
        DbContext.ExerciseExamples.RemoveRange(oldExerciseExamples);
        IEnumerable<ExerciseExample> exerciseExamples = request.Examples
            .Select(e => new ExerciseExample(
                Guid.NewGuid(),
                exercise.Id,
                e.Input,
                e.Output,
                e.Explanation));
        await DbContext.ExerciseExamples.AddRangeAsync(exerciseExamples, ct);

        List<ExerciseTestCase> oldExerciseTestCases = await DbContext.ExerciseTestCases.Where(x => x.ExerciseId == exercise.Id).ToListAsync(ct);
        DbContext.ExerciseTestCases.RemoveRange(oldExerciseTestCases);
        IEnumerable<ExerciseTestCase> testCases = request.TestCases
            .Select(tc => new ExerciseTestCase(
                Guid.NewGuid(),
                exercise.Id,
                tc.Input,
                tc.ExpectedOutput,
                tc.Description,
                tc.IsHidden,
                tc.Order));
        await DbContext.ExerciseTestCases.AddRangeAsync(testCases, ct);


        List<ExerciseDefaultCode> oldExerciseDefaultCodes = await DbContext.ExerciseDefaultCodes.Where(x => x.ExerciseId == exercise.Id).ToListAsync(ct);
        DbContext.ExerciseDefaultCodes.RemoveRange(oldExerciseDefaultCodes);
        IEnumerable<ExerciseDefaultCode> exerciseDefaultCodes = request.DefaultCodes
            .Select(x => new ExerciseDefaultCode(
                Guid.NewGuid(),
                exercise.Id,
                x.Language,
                x.StarterCode));
        await DbContext.ExerciseDefaultCodes.AddRangeAsync(exerciseDefaultCodes, ct);

        return Codes.Success;
    }
}