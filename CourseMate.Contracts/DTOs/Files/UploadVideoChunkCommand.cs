using MediatR;

namespace CourseMate.Contracts.DTOs.Files;

public class UploadVideoChunkCommand : IRequest
{
    public Guid UploadId { get; set; }
    public int ChunkIndex { get; set; }
    public int TotalChunks { get; set; }
    public byte[] Content { get; set; } = [];
}