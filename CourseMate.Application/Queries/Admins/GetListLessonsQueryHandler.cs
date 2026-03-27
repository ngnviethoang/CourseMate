using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Admins;

internal sealed class GetListLessonsQueryHandler : AbstractQueryHandler<GetListLessonsQuery, PagedDto<LessonDto>>
{
    public GetListLessonsQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<LessonDto>> Handle(GetListLessonsQuery request, CancellationToken cancellationToken)
    {
        IQueryable<LessonDto> query = from lesson in DbContext.Lessons
            join chapter in DbContext.Chapters on lesson.ChapterId equals chapter.Id
            join course in DbContext.Courses on lesson.CourseId equals course.Id
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

        query = query.WhereIf(!string.IsNullOrWhiteSpace(request.Filter), x => EF.Functions.ILike(x.Title, $"%{request.Filter}%"));

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
            .Paged(request.PageIndex, request.PageSize)
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