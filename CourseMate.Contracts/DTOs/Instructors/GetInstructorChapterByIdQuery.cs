using CourseMate.Contracts.DTOs.Admins;
using MediatR;

namespace CourseMate.Contracts.DTOs.Instructors;

public class GetInstructorChapterByIdQuery : IRequest<ChapterDto?>
{
    public Guid Id { get; set; }
}