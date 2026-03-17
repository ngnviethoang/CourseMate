using CourseMate.Contract.Enums;
using MediatR;

namespace CourseMate.Contract.DTOs.Admins;

public class UpdateLessonCommand : IRequest
{
    public Guid Id { get; set; }

    public Guid ChapterId { get; set; }

    public Guid CourseId { get; set; }

    public string Title { get; set; } = string.Empty;

    public LessonType LessonType { get; set; }

    public int Position { get; set; }
}