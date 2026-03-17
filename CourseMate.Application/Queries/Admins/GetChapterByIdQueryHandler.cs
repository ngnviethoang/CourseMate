using CourseMate.Contract.DTOs.Admins;
using CourseMate.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Admins;

internal sealed class GetChapterByIdQueryHandler : IRequestHandler<GetChapterByIdQuery, ChapterDto?>
{
    private readonly CourseMateReadOnlyDbContext _dbContext;

    public GetChapterByIdQueryHandler(CourseMateReadOnlyDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ChapterDto?> Handle(GetChapterByIdQuery request, CancellationToken cancellationToken)
    {
        IQueryable<ChapterDto> query = from chapter in _dbContext.Chapters
            join course in _dbContext.Courses on chapter.CourseId equals course.Id
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