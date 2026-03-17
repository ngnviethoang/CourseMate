using MediatR;

namespace CourseMate.Contract.DTOs.Admins;

public class UpdateChapterCommand : IRequest
{
    public Guid Id { get; set; }

    public Guid CourseId { get; set; }

    public string Title { get; set; } = string.Empty;

    public int Position { get; set; }
}