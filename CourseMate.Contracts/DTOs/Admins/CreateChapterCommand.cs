using MediatR;

namespace CourseMate.Contract.DTOs.Admins;

public class CreateChapterCommand : IRequest<ResultIdDto>
{
    public Guid CourseId { get; set; }

    public string Title { get; set; } = string.Empty;

    public int Position { get; set; }
}