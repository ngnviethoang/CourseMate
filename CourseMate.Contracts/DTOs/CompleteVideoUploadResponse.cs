namespace CourseMate.Contracts.DTOs;

public class CompleteVideoUploadResponse
{
    public Guid FileId { get; set; }
    public string FileUrl { get; set; } = string.Empty;
}