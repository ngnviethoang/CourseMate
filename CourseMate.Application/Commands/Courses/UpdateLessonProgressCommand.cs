using CourseMate.Contracts.DTOs.Commons;
using MediatR;

namespace CourseMate.Application.Commands.Courses;

public class UpdateLessonProgressCommand : IRequest<ResultIdDto>
{
    public Guid LessonId { get; set; }
    public bool IsCompleted { get; set; }
    public double Score { get; set; }
}