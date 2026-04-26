using CourseMate.Application.Shared;
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
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Difficulty { get; set; } = "Easy";
    public string Category { get; set; } = string.Empty;
    public List<UpsertExampleDto> Examples { get; set; } = [];
    public List<string> Constraints { get; set; } = [];
    public List<string> Hints { get; set; } = [];
    public List<UpsertTestCaseDto> TestCases { get; set; } = [];
    public List<UpsertDefaultCodeDto> DefaultCodes { get; set; } = [];
}

internal sealed class UpdateExerciseCommandHandler : AbstractCommandHandler<UpdateExerciseCommand, int>
{
    public UpdateExerciseCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(UpdateExerciseCommand request, CancellationToken cancellationToken)
    {
        Exercise? exercise = await DbContext.Exercises
            .Include(x => x.TestCases)
            .Include(x => x.DefaultCodes)
            .WhereIf(IsInRole(Roles.Instructor), x => x.CreatorId == CurrentUserId)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (exercise is null)
        {
            throw new EntityNotFoundException(nameof(Exercise), request.Id);
        }

        ExerciseDifficultyType difficultyType = Enum.TryParse(request.Difficulty, true, out ExerciseDifficultyType d) ? d : ExerciseDifficultyType.Easy;

        exercise.Title = request.Title;
        exercise.Description = request.Description;
        exercise.Difficulty = difficultyType;
        exercise.Category = request.Category;

        // ─ Update JSB fields ─
        exercise.Examples = request.Examples.Select(e => new ExerciseExample
        {
            Input = e.Input,
            Output = e.Output,
            Explanation = e.Explanation
        }).ToList();
        exercise.Constraints = request.Constraints;
        exercise.Hints = request.Hints;

        // ─ Test cases: upsert + remove deleted ─
        HashSet<Guid> keepTcIds = [];
        int order = 0;
        foreach (UpsertTestCaseDto dto in request.TestCases)
        {
            if (dto.Id.HasValue)
            {
                ExerciseTestCase? existing = exercise.TestCases.FirstOrDefault(t => t.Id == dto.Id.Value);
                if (existing is not null)
                {
                    existing.Input = dto.Input;
                    existing.ExpectedOutput = dto.ExpectedOutput;
                    existing.Description = dto.Description;
                    existing.IsHidden = dto.IsHidden;
                    existing.Order = dto.Order > 0 ? dto.Order : order;
                    keepTcIds.Add(existing.Id);
                }
            }
            else
            {
                ExerciseTestCase newTc = new(Guid.NewGuid(), exercise.Id, dto.Input, dto.ExpectedOutput, dto.Description, dto.IsHidden, dto.Order > 0 ? dto.Order : order);
                exercise.TestCases.Add(newTc);
                keepTcIds.Add(newTc.Id);
            }

            order++;
        }

        foreach (ExerciseTestCase removed in exercise.TestCases.Where(t => !keepTcIds.Contains(t.Id)).ToList())
        {
            DbContext.ExerciseTestCases.Remove(removed);
        }

        // ─ Default codes: upsert + remove deleted ─
        HashSet<Guid> keepDcIds = [];
        foreach (UpsertDefaultCodeDto dto in request.DefaultCodes)
        {
            if (dto.Id.HasValue)
            {
                ExerciseDefaultCode? existing = exercise.DefaultCodes.FirstOrDefault(c => c.Id == dto.Id.Value);
                if (existing is not null)
                {
                    existing.Language = dto.Language;
                    existing.StarterCode = dto.StarterCode;
                    keepDcIds.Add(existing.Id);
                }
            }
            else
            {
                ExerciseDefaultCode newDc = new(Guid.NewGuid(), exercise.Id, dto.Language, dto.StarterCode);
                exercise.DefaultCodes.Add(newDc);
                keepDcIds.Add(newDc.Id);
            }
        }

        foreach (ExerciseDefaultCode removed in exercise.DefaultCodes.Where(c => !keepDcIds.Contains(c.Id)).ToList())
        {
            DbContext.ExerciseDefaultCodes.Remove(removed);
        }

        DbContext.Exercises.Update(exercise);
        return Codes.Success;
    }
}