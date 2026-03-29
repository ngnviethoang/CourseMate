using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Contracts.DTOs.Commons;

namespace CourseMate.Contracts.DTOs.Instructors;

public class GetInstructorChaptersQuery : GetListQuery<ChapterDto>
{
    public Guid? CourseId { get; set; }
}