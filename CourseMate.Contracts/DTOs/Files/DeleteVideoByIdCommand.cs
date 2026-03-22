using MediatR;

namespace CourseMate.Contracts.DTOs.Files;

public class DeleteVideoByIdCommand : IRequest
{
    public Guid FileId { get; set; }
}