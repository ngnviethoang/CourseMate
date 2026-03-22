using MediatR;

namespace CourseMate.Contracts.DTOs.Files;

public class GetImageFileQuery : IRequest<ImageFileResponse?>
{
    public Guid FileId { get; set; }
}

public class ImageFileResponse
{
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public byte[] Content { get; set; } = [];
}