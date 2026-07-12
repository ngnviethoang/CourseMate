using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.DTOs.Exercises;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using PayOS.Exceptions;

namespace CourseMate.Application.Commands.Submissions;

public class SubmitExerciseCommand : IRequest<ResultIdDto>
{
    public Guid ExerciseId { get; set; }
    public SubmitExerciseRequest Payload { get; set; } = new();
}

public class SubmitExerciseCommandHandler : AbstractCommandHandler<SubmitExerciseCommand, ResultIdDto>
{
    public SubmitExerciseCommandHandler(
        CourseMateDbContext courseMateDbContext,
        IHttpContextAccessor httpContextAccessor
    ) : base(courseMateDbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(SubmitExerciseCommand request, CancellationToken ct)
    {
        bool exerciseExists = await DbContext.Exercises.AnyAsync(e => e.Id == request.ExerciseId, ct);
        if (!exerciseExists)
        {
            throw new NotFoundException($"Exercise {request.ExerciseId} not found");
        }

        ExerciseSubmission submission = new(
            Guid.NewGuid(),
            request.ExerciseId,
            request.Payload.Language,
            request.Payload.Code,
            request.Payload.Passed,
            request.Payload.Score,
            request.Payload.TotalTime,
            request.Payload.TotalMemory
        );

        await DbContext.ExerciseSubmissions.AddAsync(submission, ct);
        await DbContext.SaveChangesAsync(ct);
        return new ResultIdDto { Id = submission.Id };
    }
}