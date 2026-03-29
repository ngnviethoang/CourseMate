using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Contracts.DTOs.Instructors;
using CourseMate.Persistent;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Instructors;

internal sealed class GetInstructorChapterByIdQueryHandler
    : AbstractQueryHandler<GetInstructorChapterByIdQuery, ChapterDto?>
{
    public GetInstructorChapterByIdQueryHandler(
        CourseMateReadOnlyDbContext dbContext,
        IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ChapterDto?> Handle(
        GetInstructorChapterByIdQuery request,
        CancellationToken cancellationToken)
    {
        Guid instructorId = GetCurrentUserId();

        ChapterDto? result = await (
            from chapter in DbContext.Chapters
            join course in DbContext.Courses on chapter.CourseId equals course.Id
            where chapter.Id == request.Id && course.InstructorId == instructorId
            select new ChapterDto
            {
                Id = chapter.Id,
                CourseId = chapter.CourseId,
                CourseName = course.Title,
                Title = chapter.Title,
                Position = chapter.Position,
                CreationTime = chapter.CreationTime,
                LastModificationTime = chapter.LastModificationTime
            }
        ).FirstOrDefaultAsync(cancellationToken);

        return result;
    }
}