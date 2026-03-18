using MediatR;

namespace CourseMate.Contracts.DTOs.Admins;

public class DeleteChapterCommand : IRequest
{
    public DeleteChapterCommand(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }
}