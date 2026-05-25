using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Courses;

public class GetListChaptersQuery : GetListQuery<ChapterDto>
{
    public Guid? CourseId { get; set; }
}

internal sealed class GetListChaptersQueryHandler : AbstractQueryHandler<GetListChaptersQuery, PagedDto<ChapterDto>>
{
    public GetListChaptersQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<ChapterDto>> Handle(GetListChaptersQuery request, CancellationToken ct)
    {
        Guid userId = CurrentUserId;
        bool isAdmin = IsInRole(Roles.Admin);
        bool isInstructor = IsInRole(Roles.Instructor);

        if (request.CourseId.HasValue)
        {
            await EnsureEnrollmentAsync(request.CourseId.Value);
        }

        IQueryable<ChapterDto> query =
            from chapter in DbContext.Chapters
            join course in DbContext.Courses on chapter.CourseId equals course.Id
            where (request.CourseId == null || course.Id == request.CourseId)
                  && (course.IsPublished || isAdmin || (isInstructor && course.InstructorId == userId))
            select new ChapterDto
            {
                Id = chapter.Id,
                CourseId = chapter.CourseId,
                CourseName = course.Title,
                Title = chapter.Title,
                Position = chapter.Position,
                InstructorId = course.InstructorId,
                CreationTime = chapter.CreationTime,
                LastModificationTime = chapter.LastModificationTime
            };

        query = query
            .WhereIf(request.Id.HasValue, x => x.Id == request.Id)
            .WhereIf(!string.IsNullOrWhiteSpace(request.Filter), x => EF.Functions.ILike(x.Title, $"%{request.Filter}%"));

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

        int total = await query.CountAsync(ct);

        List<ChapterDto> chapters = await query
            .Paged(request.PageIndex, request.PageSize)
            .ToListAsync(ct);

        return new PagedDto<ChapterDto>
        {
            Items = chapters,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = total
        };
    }
}