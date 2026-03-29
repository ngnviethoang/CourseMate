using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Contracts.DTOs.Commons;

namespace CourseMate.Contracts.DTOs.Instructors;

public class GetInstructorLessonsQuery : GetListQuery<LessonDto>
{
    public Guid? CourseId { get; set; }

    public Guid? ChapterId { get; set; }
}