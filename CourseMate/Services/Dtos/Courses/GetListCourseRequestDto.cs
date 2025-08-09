namespace CourseMate.Services.Dtos.Courses;

public class GetListCourseRequestDto : GetListRequestDto
{
    public Guid? CategoryId { get; set; }
}