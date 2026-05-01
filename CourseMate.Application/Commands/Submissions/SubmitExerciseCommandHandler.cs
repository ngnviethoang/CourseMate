using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

using CourseMate.Contracts.DTOs.Commons;
using PayOS.Exceptions;

namespace CourseMate.Application.Commands.Submissions;

public class SubmitExerciseCommandHandler : IRequestHandler<SubmitExerciseCommand, ResultIdDto>
{
    private readonly CourseMateDbContext _dbContext;

    public SubmitExerciseCommandHandler(CourseMateDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ResultIdDto> Handle(SubmitExerciseCommand request, CancellationToken cancellationToken)
    {
        var exerciseExists = await _dbContext.Exercises.AnyAsync(e => e.Id == request.ExerciseId, cancellationToken);
        if (!exerciseExists)
        {
            throw new NotFoundException($"Exercise {request.ExerciseId} not found");
        }

        var submission = new ExerciseSubmission(
            Guid.NewGuid(),
            request.ExerciseId,
            request.Payload.Language,
            request.Payload.Code,
            request.Payload.Passed,
            request.Payload.Score,
            request.Payload.TotalTime,
            request.Payload.TotalMemory
        );

        await _dbContext.ExerciseSubmissions.AddAsync(submission, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new ResultIdDto { Id = submission.Id };
    }
}
