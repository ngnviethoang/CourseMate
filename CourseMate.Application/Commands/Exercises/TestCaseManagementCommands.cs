using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Exercises;

// ─── Commands ────────────────────────────────────────────────────────────────

public class AddTestCaseCommand : IRequest<ResultIdDto>
{
    public Guid ExerciseId { get; set; }
    public string Input { get; set; } = string.Empty;
    public string ExpectedOutput { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsHidden { get; set; }
    public int Order { get; set; }
}

public class UpdateTestCaseCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
    public string Input { get; set; } = string.Empty;
    public string ExpectedOutput { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsHidden { get; set; }
    public int Order { get; set; }
}

public class DeleteTestCaseCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}

// ─── Handlers ────────────────────────────────────────────────────────────────

internal sealed class AddTestCaseCommandHandler : AbstractCommandHandler<AddTestCaseCommand, ResultIdDto>
{
    public AddTestCaseCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor) { }

    public override async Task<ResultIdDto> Handle(AddTestCaseCommand request, CancellationToken ct)
    {
        Exercise? exercise = await DbContext.Exercises
            .FirstOrDefaultAsync(x => x.Id == request.ExerciseId, ct);

        if (exercise is null) throw new EntityNotFoundException(nameof(Exercise), request.ExerciseId);

        ExerciseTestCase testCase = new(
            Guid.NewGuid(),
            exercise.Id,
            request.Input,
            request.ExpectedOutput,
            request.Description,
            request.IsHidden,
            request.Order
        );

        await DbContext.ExerciseTestCases.AddAsync(testCase, ct);
        await DbContext.SaveChangesAsync(ct);

        return new ResultIdDto { Id = testCase.Id };
    }
}

internal sealed class UpdateTestCaseCommandHandler : AbstractCommandHandler<UpdateTestCaseCommand, Unit>
{
    public UpdateTestCaseCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor) { }

    public override async Task<Unit> Handle(UpdateTestCaseCommand request, CancellationToken ct)
    {
        ExerciseTestCase? testCase = await DbContext.ExerciseTestCases
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (testCase is null) throw new EntityNotFoundException(nameof(ExerciseTestCase), request.Id);

        testCase.Input = request.Input;
        testCase.ExpectedOutput = request.ExpectedOutput;
        testCase.Description = request.Description;
        testCase.IsHidden = request.IsHidden;
        testCase.Order = request.Order;

        await DbContext.SaveChangesAsync(ct);
        return Unit.Value;
    }
}

internal sealed class DeleteTestCaseCommandHandler : AbstractCommandHandler<DeleteTestCaseCommand, Unit>
{
    public DeleteTestCaseCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor) { }

    public override async Task<Unit> Handle(DeleteTestCaseCommand request, CancellationToken ct)
    {
        ExerciseTestCase? testCase = await DbContext.ExerciseTestCases
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (testCase is null) throw new EntityNotFoundException(nameof(ExerciseTestCase), request.Id);

        DbContext.ExerciseTestCases.Remove(testCase);
        await DbContext.SaveChangesAsync(ct);
        return Unit.Value;
    }
}
