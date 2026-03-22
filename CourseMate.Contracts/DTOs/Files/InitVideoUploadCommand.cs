using MediatR;

namespace CourseMate.Contracts.DTOs.Files;

public class InitVideoUploadCommand : IRequest<InitVideoUploadResponse>
{
    public string FileName { get; set; } = string.Empty;
    public long FileSize { get; set; }
}

public class InitVideoUploadResponse
{
    public Guid FileId { get; set; }
    public long MaxTotalTrunks { get; set; }
}