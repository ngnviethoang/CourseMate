namespace CourseMate.Services.Dtos.Lessons;

public class GetListLessonRequestDto : GetListRequestDto
{
    public Guid? ChapterId { get; set; }
}