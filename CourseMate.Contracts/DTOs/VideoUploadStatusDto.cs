using CourseMate.Contracts.Enums;

namespace CourseMate.Contracts.DTOs;

public class VideoUploadStatusDto
{
    public Guid UploadId { get; set; }
    public FileStatus Status { get; set; }
    public int Progress { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}