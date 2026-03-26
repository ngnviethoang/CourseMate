using MediatR;

namespace CourseMate.Contracts.DTOs.Files;

public class GetVideoFilePathQuery : IRequest<VideoFilePathDto?>
{
    public Guid FileId { get; set; }
}

public class VideoFilePathDto
{
    public string FilePath { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
}