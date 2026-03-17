using CourseMate.Contract.Constants;
using CourseMate.Contract.DTOs.Admins;
using CourseMate.Contract.Exceptions;
using CourseMate.Core;
using CourseMate.Core.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Admins;

internal sealed class DeleteChapterCommandHandler : IRequestHandler<DeleteChapterCommand>
{
    private readonly CourseMateDbContext _dbContext;

    public DeleteChapterCommandHandler(CourseMateDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Handle(DeleteChapterCommand request, CancellationToken cancellationToken)
    {
        Chapter? chapter = await _dbContext.Chapters
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (chapter == null)
        {
            throw new EntityNotFoundException(ExceptionMessages.EntityNotFound);
        }

        _dbContext.Remove(chapter);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}