using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.DTOs.Exercises;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PayOS.Exceptions;

namespace CourseMate.Application.Commands.Submissions;

public class SubmitExerciseCommand : IRequest<ResultIdDto>
{
    public Guid ExerciseId { get; set; }
    public SubmitExerciseRequest Payload { get; set; }
}

public class SubmitExerciseCommandHandler : IRequestHandler<SubmitExerciseCommand, ResultIdDto>
{
    private readonly CourseMateDbContext _dbContext;

    public SubmitExerciseCommandHandler(CourseMateDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ResultIdDto> Handle(SubmitExerciseCommand request, CancellationToken cancellationToken)
    {
        bool exerciseExists = await _dbContext.Exercises.AnyAsync(e => e.Id == request.ExerciseId, cancellationToken);
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

        await _dbContext.ExerciseSubmissions.AddAsync(submission, cancellationToken);
        return new ResultIdDto { Id = submission.Id };
    }
}