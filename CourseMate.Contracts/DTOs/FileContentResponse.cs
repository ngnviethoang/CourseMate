namespace CourseMate.Contracts.DTOs;

public class FileContentResponse
{
    public string FileName { get; set; } = string.Empty;
    public byte[] Content { get; set; } = [];
}