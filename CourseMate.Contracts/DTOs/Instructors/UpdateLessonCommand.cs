using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts.Enums;
using MediatR;

namespace CourseMate.Contracts.DTOs.Instructors;

public class UpdateLessonCommand : IRequest<int>
{
    public Guid Id { get; set; }

    public Guid ChapterId { get; set; }

    public Guid CourseId { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Title { get; set; } = string.Empty;

    public LessonType LessonType { get; set; }

    public int Position { get; set; }
}