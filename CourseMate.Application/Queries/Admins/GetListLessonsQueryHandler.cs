using CourseMate.Contract.DTOs;
using CourseMate.Contract.DTOs.Admins;
using CourseMate.Core;
using CourseMate.Core.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Admins;

internal sealed class GetListLessonsQueryHandler : IRequestHandler<GetListLessonsQuery, PagedDto<LessonDto>>
{
    private readonly CourseMateReadOnlyDbContext _dbContext;

    public GetListLessonsQueryHandler(CourseMateReadOnlyDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedDto<LessonDto>> Handle(GetListLessonsQuery request, CancellationToken cancellationToken)
    {
        IQueryable<Lesson> baseQuery = _dbContext.Lessons.AsQueryable();

        if (!string.IsNullOrEmpty(request.Filter))
        {
            baseQuery = baseQuery.Where(x => x.Title.Contains(request.Filter));
        }

        IQueryable<LessonDto> query = from lesson in baseQuery
            join chapter in _dbContext.Chapters on lesson.ChapterId equals chapter.Id
            join course in _dbContext.Courses on lesson.CourseId equals course.Id
            select new LessonDto
            {
                Id = lesson.Id,
                ChapterId = lesson.ChapterId,
                ChapterName = chapter.Title,
                CourseId = lesson.CourseId,
                CourseName = course.Title,
                Title = lesson.Title,
                LessonType = lesson.LessonType,
                Position = lesson.Position,
                CreationTime = lesson.CreationTime,
                LastModificationTime = lesson.LastModificationTime
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

        List<LessonDto> lessons = await query
            .Skip((request.PageIndex - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedDto<LessonDto>
        {
            Items = lessons,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = total
        };
    }
}