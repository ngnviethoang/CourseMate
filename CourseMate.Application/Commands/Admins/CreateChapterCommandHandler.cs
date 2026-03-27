using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Admins;

internal sealed class CreateChapterCommandHandler : AbstractCommandHandler<CreateChapterCommand, ResultIdDto>
{
    public CreateChapterCommandHandler(CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(CreateChapterCommand request, CancellationToken cancellationToken)
    {
        Chapter chapter = new(
            Guid.NewGuid(),
            request.CourseId,
            request.Title,
            request.Position
        );

        await DbContext.AddAsync(chapter, cancellationToken);
        return new ResultIdDto { Id = chapter.Id };
    }
}