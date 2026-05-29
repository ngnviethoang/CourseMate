using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Chapters;

public class GetChapterByIdQuery : IRequest<ChapterDto?>
{
    public Guid Id { get; set; }
}

public sealed class GetChapterByIdQueryHandler : AbstractQueryHandler<GetChapterByIdQuery, ChapterDto?>
{
    public GetChapterByIdQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ChapterDto?> Handle(GetChapterByIdQuery request, CancellationToken ct)
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

        ChapterDto? chapterItem = await query
            .WhereIf(IsInRole(Roles.Instructor), chapter => chapter.Id == request.Id)
            .FirstOrDefaultAsync(ct);

        if (chapterItem == null)
        {
            return null;
        }

        await EnsureEnrollmentAsync(chapterItem.CourseId);

        List<Guid> chapterOrder = await DbContext.Chapters
            .Where(x => x.CourseId == chapterItem.CourseId)
            .OrderBy(x => x.Position)
            .Select(x => x.Id)
            .ToListAsync(ct);

        int sortOrder = chapterOrder.FindIndex(x => x == chapterItem.Id) + 1;

        chapterItem.SortOrder = sortOrder < 1 ? 1 : sortOrder;
        return chapterItem;
    }
}