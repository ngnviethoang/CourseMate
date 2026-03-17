using CourseMate.Contract.Constants;
using CourseMate.Contract.DTOs.Admins;
using CourseMate.Contract.Exceptions;
using CourseMate.Core;
using CourseMate.Core.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Admins;

internal sealed class UpdateChapterCommandHandler : IRequestHandler<UpdateChapterCommand>
{
    private readonly CourseMateDbContext _dbContext;

    public UpdateChapterCommandHandler(CourseMateDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Handle(UpdateChapterCommand request, CancellationToken cancellationToken)
    {
        Chapter? chapter = await _dbContext.Chapters.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (chapter == null)
        {
            throw new EntityNotFoundException(ExceptionMessages.EntityNotFound);
        }

        chapter.CourseId = request.CourseId;
        chapter.Title = request.Title;
        chapter.Position = request.Position;

        _dbContext.Update(chapter);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}