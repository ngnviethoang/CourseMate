using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Courses;

public class GetChapterByIdQuery : IRequest<ChapterDto?>
{
    public Guid Id { get; set; }
}

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

        ChapterDto? result = await query
            .WhereIf(IsInRole(Roles.Instructor), chapter => chapter.Id == request.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (result != null)
        {
            await EnsureEnrollmentAsync(result.CourseId);
        }

        return result;
    }
}