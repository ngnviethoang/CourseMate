namespace CourseMate.Services.Dtos.Chapters;

public class GetListChapterRequestDto : GetListRequestDto
{
    public Guid? CourseId { get; set; }
}