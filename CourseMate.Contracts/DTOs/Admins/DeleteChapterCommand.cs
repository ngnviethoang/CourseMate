using MediatR;

namespace CourseMate.Contract.DTOs.Admins;

public class DeleteChapterCommand : IRequest
{
    public DeleteChapterCommand(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }
}