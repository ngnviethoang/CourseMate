using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Admins;

internal sealed class GetListChaptersQueryHandler : AbstractQueryHandler<GetListChaptersQuery, PagedDto<ChapterDto>>
{
    public GetListChaptersQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<ChapterDto>> Handle(GetListChaptersQuery request, CancellationToken cancellationToken)
    {
        IQueryable<ChapterDto> query = from chapter in DbContext.Chapters
            join course in DbContext.Courses on chapter.CourseId equals course.Id
            select new ChapterDto
            {
                Id = chapter.Id,
                CourseId = chapter.CourseId,
                CourseName = course.Title,
                Title = chapter.Title,
                Position = chapter.Position,
                CreationTime = chapter.CreationTime,
                LastModificationTime = chapter.LastModificationTime
            };

        query = query.WhereIf(!string.IsNullOrWhiteSpace(request.Filter),
            x => EF.Functions.ILike(x.Title, $"%{request.Filter}%"));

        query = request.Sorting switch
        {
            "title" => query.OrderBy(x => x.Title),
            "title_desc" => query.OrderByDescending(x => x.Title),
            "position" => query.OrderBy(x => x.Position),
            "position_desc" => query.OrderByDescending(x => x.Position),
            "creationTime_desc" => query.OrderByDescending(x => x.CreationTime),
            "lastModificationTime_desc" => query.OrderByDescending(x => x.LastModificationTime),
            _ => query.OrderBy(x => x.CreationTime)
        };

        int total = await query.CountAsync(cancellationToken);

        List<ChapterDto> chapters = await query
            .Paged(request.PageIndex, request.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedDto<ChapterDto>
        {
            Items = chapters,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = total
        };
    }
}