using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Contracts.Exceptions;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Admins;

internal sealed class UpdateChapterAbstractCommandHandler : AbstractCommandHandler<UpdateChapterCommand>
{
    public UpdateChapterAbstractCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task Handle(UpdateChapterCommand request, CancellationToken cancellationToken)
    {
        Chapter? chapter = await DbContext.Chapters.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (chapter == null)
        {
            throw new EntityNotFoundException(nameof(Chapter), request.Id);
        }

        chapter.CourseId = request.CourseId;
        chapter.Title = request.Title;
        chapter.Position = request.Position;

        DbContext.Update(chapter);
        await DbContext.SaveChangesAsync(cancellationToken);
    }
}