using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class GetChapterByIdQuery : IRequest<ChapterDto?>
{
    public Guid Id { get; set; }
}