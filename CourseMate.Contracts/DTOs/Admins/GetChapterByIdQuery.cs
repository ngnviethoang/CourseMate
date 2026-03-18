using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class GetChapterByIdQuery : IRequest<ChapterDto?>
{
    public GetChapterByIdQuery(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }
}