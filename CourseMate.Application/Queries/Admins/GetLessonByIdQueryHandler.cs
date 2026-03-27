using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Persistent;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Admins;

internal sealed class GetLessonByIdQueryHandler : AbstractQueryHandler<GetLessonByIdQuery, LessonDto?>
{
    public GetLessonByIdQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<LessonDto?> Handle(GetLessonByIdQuery request, CancellationToken cancellationToken)
    {
        IQueryable<LessonDto> query = from lesson in DbContext.Lessons
            join chapter in DbContext.Chapters on lesson.ChapterId equals chapter.Id
            join course in DbContext.Courses on lesson.CourseId equals course.Id
            where lesson.Id == request.Id
            select new LessonDto
            {
                Id = lesson.Id,
                ChapterId = lesson.ChapterId,
                ChapterName = chapter.Title,
                CourseId = lesson.CourseId,
                CourseName = course.Title,
                Title = lesson.Title,
                LessonType = lesson.LessonType,
                Position = lesson.Position
            };

        LessonDto? result = await query.FirstOrDefaultAsync(cancellationToken);

        return result;
    }
}