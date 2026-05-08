namespace CourseMate.Contracts.DTOs;

public class FileUploadResponse
{
    public Guid FileId { get; set; }
    public string FileUrl { get; set; } = string.Empty;
}