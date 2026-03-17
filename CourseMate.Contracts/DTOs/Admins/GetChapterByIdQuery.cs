using MediatR;

namespace CourseMate.Contract.DTOs.Admins;

public class GetChapterByIdQuery : IRequest<ChapterDto?>
{
    public GetChapterByIdQuery(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }
}