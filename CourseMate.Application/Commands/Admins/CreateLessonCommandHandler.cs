using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using MediatR;

namespace CourseMate.Application.Commands.Admins;

internal sealed class CreateLessonCommandHandler : IRequestHandler<CreateLessonCommand, ResultIdDto>
{
    private readonly CourseMateDbContext _dbContext;

    public CreateLessonCommandHandler(CourseMateDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ResultIdDto> Handle(CreateLessonCommand request, CancellationToken cancellationToken)
    {
        Lesson lesson = new(
            Guid.NewGuid(),
            request.ChapterId,
            request.CourseId,
            request.Title,
            request.LessonType,
            request.Position
        );

        await _dbContext.AddAsync(lesson, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new ResultIdDto(lesson.Id);
    }
}