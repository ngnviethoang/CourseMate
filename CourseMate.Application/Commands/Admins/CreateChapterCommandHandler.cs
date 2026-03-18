using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using MediatR;

namespace CourseMate.Application.Commands.Admins;

internal sealed class CreateChapterCommandHandler : IRequestHandler<CreateChapterCommand, ResultIdDto>
{
    private readonly CourseMateDbContext _dbContext;

    public CreateChapterCommandHandler(CourseMateDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ResultIdDto> Handle(CreateChapterCommand request, CancellationToken cancellationToken)
    {
        Chapter chapter = new(
            Guid.NewGuid(),
            request.CourseId,
            request.Title,
            request.Position
        );

        await _dbContext.AddAsync(chapter, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new ResultIdDto(chapter.Id);
    }
}