using CourseMate.Contracts.DTOs.Exercises;
using MediatR;

using CourseMate.Contracts.DTOs.Commons;

namespace CourseMate.Application.Commands.Submissions;

public class SubmitExerciseCommand : IRequest<ResultIdDto>
{
    public Guid ExerciseId { get; set; }
    public SubmitExerciseRequest Payload { get; set; }

    public SubmitExerciseCommand(Guid exerciseId, SubmitExerciseRequest payload)
    {
        ExerciseId = exerciseId;
        Payload = payload;
    }
}
