namespace CourseMate.Contracts.DTOs;

public class UploadImageResponse
{
    public Guid FileId { get; set; }
    public string FileUrl { get; set; } = string.Empty;
}