using MediatR;

namespace CourseMate.Contracts.DTOs.Files;

public class InitVideoUploadCommand : IRequest<InitVideoUploadResponse>
{
    public string FileName { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string ContentType { get; set; } = string.Empty;
}

public class InitVideoUploadResponse
{
    public Guid UploadId { get; set; }
    public long MaxTotalTrunks { get; set; }
}