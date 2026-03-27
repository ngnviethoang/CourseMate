using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Persistent;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Admins;

internal sealed class GetChapterByIdQueryHandler : AbstractQueryHandler<GetChapterByIdQuery, ChapterDto?>
{
    public GetChapterByIdQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ChapterDto?> Handle(GetChapterByIdQuery request, CancellationToken cancellationToken)
    {
        IQueryable<ChapterDto> query = from chapter in DbContext.Chapters
            join course in DbContext.Courses on chapter.CourseId equals course.Id
            where chapter.Id == request.Id
            select new ChapterDto
            {
                Id = chapter.Id,
                CourseId = chapter.CourseId,
                CourseName = course.Title,
                Title = chapter.Title,
                Position = chapter.Position
            };

        ChapterDto? result = await query.FirstOrDefaultAsync(cancellationToken);

        return result;
    }
}