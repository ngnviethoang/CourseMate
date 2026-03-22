using MediatR;

namespace CourseMate.Contracts.DTOs.Files;

public class DeleteVideoUploadCommand : IRequest
{
    public Guid UploadId { get; set; }
}