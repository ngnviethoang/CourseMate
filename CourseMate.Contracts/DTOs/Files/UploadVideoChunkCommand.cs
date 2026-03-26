using MediatR;

namespace CourseMate.Contracts.DTOs.Files;

public class UploadVideoChunkCommand : IRequest<int>
{
    public Guid FileId { get; set; }

    public string FileName { get; set; } = string.Empty;

    public int ChunkIndex { get; set; }

    public byte[] Content { get; set; } = [];
}