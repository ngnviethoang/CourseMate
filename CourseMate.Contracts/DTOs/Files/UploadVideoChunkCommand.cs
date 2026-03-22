using MediatR;

namespace CourseMate.Contracts.DTOs.Files;

public class UploadVideoChunkCommand : IRequest
{
    public Guid FileId { get; set; }
    public int ChunkIndex { get; set; }
    public byte[] Content { get; set; } = [];
}