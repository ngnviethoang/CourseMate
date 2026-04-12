using MediatR;

namespace CourseMate.Contracts.DTOs;

public class UpdateOutlineCommand : IRequest<OutlineDto>
{
    public Guid LessonId { get; set; }
    public List<OutlineSectionDto> Sections { get; set; } = [];
}