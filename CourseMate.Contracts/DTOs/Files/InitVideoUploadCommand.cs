using MediatR;

namespace CourseMate.Contracts.DTOs.Files;

public class InitVideoUploadCommand : IRequest<InitVideoUploadResponse>
{
    public string FileName { get; set; } = string.Empty;
}

public class InitVideoUploadResponse
{
    public Guid FileId { get; set; }
}