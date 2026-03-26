using MediatR;

namespace CourseMate.Contracts.DTOs.Files;

public class DeleteVideoByIdCommand : IRequest<int>
{
    public Guid FileId { get; set; }
}