using MediatR;

namespace CourseMate.Contracts.DTOs.Files;

public class CompleteVideoUploadCommand : IRequest
{
    public Guid UploadId { get; set; }
}