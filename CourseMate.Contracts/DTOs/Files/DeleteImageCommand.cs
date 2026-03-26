using MediatR;

namespace CourseMate.Contracts.DTOs.Files;

public class DeleteImageCommand : IRequest<int>
{
    public Guid FileId { get; set; }
}