namespace CourseMate.Services.Dtos.Chapters;

public class CreateUpdateChapterDto
{
    [MaxLength(CourseMateConst.DescriptionMaxLength)]
    public string Title { get; set; } = string.Empty;

    public Guid CourseId { get; set; }

    [Range(0, int.MaxValue)]
    public int Position { get; set; }

    [MaxLength(CourseMateConst.DescriptionMaxLength)]
    public string Description { get; set; } = string.Empty;
}