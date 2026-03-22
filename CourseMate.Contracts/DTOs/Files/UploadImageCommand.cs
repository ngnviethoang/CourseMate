using MediatR;

namespace CourseMate.Contracts.DTOs.Files;

public class UploadImageCommand : IRequest<UploadImageResponse>
{
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public byte[] Content { get; set; } = [];
}

public class UploadImageResponse
{
    public Guid FileId { get; set; }
    public string FileUrl { get; set; } = string.Empty;
}