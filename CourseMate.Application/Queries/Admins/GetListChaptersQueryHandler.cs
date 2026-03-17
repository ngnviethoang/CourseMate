using CourseMate.Contract.DTOs;
using CourseMate.Contract.DTOs.Admins;
using CourseMate.Core;
using CourseMate.Core.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Admins;

internal sealed class GetListChaptersQueryHandler : IRequestHandler<GetListChaptersQuery, PagedDto<ChapterDto>>
{
    private readonly CourseMateReadOnlyDbContext _dbContext;

    public GetListChaptersQueryHandler(CourseMateReadOnlyDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedDto<ChapterDto>> Handle(GetListChaptersQuery request, CancellationToken cancellationToken)
    {
        IQueryable<Chapter> baseQuery = _dbContext.Chapters.AsQueryable();

        if (!string.IsNullOrEmpty(request.Filter))
        {
            baseQuery = baseQuery.Where(x => x.Title.Contains(request.Filter));
        }

        IQueryable<ChapterDto> query = from chapter in baseQuery
            join course in _dbContext.Courses on chapter.CourseId equals course.Id
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
            .Skip((request.PageIndex - 1) * request.PageSize)
            .Take(request.PageSize)
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