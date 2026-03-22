using CourseMate.Contracts.Enums;
using MediatR;

namespace CourseMate.Contracts.DTOs.Files;

public class GetVideoUploadStatusQuery : IRequest<VideoUploadStatusDto?>
{
    public Guid UploadId { get; set; }
}

public class VideoUploadStatusDto
{
    public Guid UploadId { get; set; }
    public FileStatus Status { get; set; }
    public int Progress { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}