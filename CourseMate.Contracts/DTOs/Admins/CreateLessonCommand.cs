using CourseMate.Contracts.Enums;
using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class CreateLessonCommand : IRequest<ResultIdDto>
{
    public Guid ChapterId { get; set; }

    public Guid CourseId { get; set; }

    public string Title { get; set; } = string.Empty;

    public LessonType LessonType { get; set; }

    public int Position { get; set; }
}