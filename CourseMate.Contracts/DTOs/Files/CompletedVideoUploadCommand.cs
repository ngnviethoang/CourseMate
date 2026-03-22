using MediatR;

namespace CourseMate.Contracts.DTOs.Files;

public class CompletedVideoUploadCommand : IRequest<CompleteVideoUploadResponse>
{
    public Guid UploadId { get; set; }
    public int TotalChunks { get; set; }
}

public class CompleteVideoUploadResponse
{
    public Guid FileId { get; set; }
    public string FileUrl { get; set; } = string.Empty;
}