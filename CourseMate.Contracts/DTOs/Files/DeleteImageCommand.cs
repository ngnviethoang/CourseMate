using MediatR;

namespace CourseMate.Contracts.DTOs.Files;

public class DeleteImageCommand : IRequest
{
    public Guid FileId { get; set; }
}