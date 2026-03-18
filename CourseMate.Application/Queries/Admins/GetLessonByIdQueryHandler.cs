using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Admins;

internal sealed class GetLessonByIdQueryHandler : IRequestHandler<GetLessonByIdQuery, LessonDto?>
{
    private readonly CourseMateReadOnlyDbContext _dbContext;

    public GetLessonByIdQueryHandler(CourseMateReadOnlyDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<LessonDto?> Handle(GetLessonByIdQuery request, CancellationToken cancellationToken)
    {
        IQueryable<LessonDto> query = from lesson in _dbContext.Lessons
            join chapter in _dbContext.Chapters on lesson.ChapterId equals chapter.Id
            join course in _dbContext.Courses on lesson.CourseId equals course.Id
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