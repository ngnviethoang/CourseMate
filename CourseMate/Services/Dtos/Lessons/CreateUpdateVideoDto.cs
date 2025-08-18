namespace CourseMate.Services.Dtos.Lessons;

public class CreateUpdateVideoDto
{
    [MaxLength(CourseMateConst.FileNameMaxLength)]
    public string VideoFile { get; set; } = string.Empty;

    public TimeSpan Duration { get; set; }
}