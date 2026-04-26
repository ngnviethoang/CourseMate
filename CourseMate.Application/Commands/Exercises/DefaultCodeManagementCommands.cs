using CourseMate.Application.Shared;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Exercises;

// ─── Commands ────────────────────────────────────────────────────────────────

public class UpsertDefaultCodeCommand : IRequest<Unit>
{
    public Guid ExerciseId { get; set; }
    public string Language { get; set; } = string.Empty;
    public string StarterCode { get; set; } = string.Empty;
}

// ─── Handlers ────────────────────────────────────────────────────────────────

internal sealed class UpsertDefaultCodeCommandHandler : AbstractCommandHandler<UpsertDefaultCodeCommand, Unit>
{
    public UpsertDefaultCodeCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor) { }

    public override async Task<Unit> Handle(UpsertDefaultCodeCommand request, CancellationToken ct)
    {
        Exercise? exercise = await DbContext.Exercises
            .FirstOrDefaultAsync(x => x.Id == request.ExerciseId, ct);

        if (exercise is null) throw new EntityNotFoundException(nameof(Exercise), request.ExerciseId);

        ExerciseDefaultCode? defaultCode = await DbContext.ExerciseDefaultCodes
            .FirstOrDefaultAsync(x => x.ExerciseId == request.ExerciseId && x.Language == request.Language, ct);

        if (defaultCode is null)
        {
            defaultCode = new ExerciseDefaultCode(
                Guid.NewGuid(),
                exercise.Id,
                request.Language,
                request.StarterCode
            );
            await DbContext.ExerciseDefaultCodes.AddAsync(defaultCode, ct);
        }
        else
        {
            defaultCode.StarterCode = request.StarterCode;
        }

        await DbContext.SaveChangesAsync(ct);
        return Unit.Value;
    }
}
