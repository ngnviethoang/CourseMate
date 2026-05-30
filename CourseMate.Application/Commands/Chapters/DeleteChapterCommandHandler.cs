using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Chapters;

public class DeleteChapterCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}

public sealed class DeleteChapterCommandHandler : AbstractCommandHandler<DeleteChapterCommand, Unit>
{
    public DeleteChapterCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<Unit> Handle(DeleteChapterCommand request, CancellationToken ct)
    {
        ChapterWithInstructor? item = await (
                from chapter in DbContext.Chapters
                join course in DbContext.Courses on chapter.CourseId equals course.Id
                where chapter.Id == request.Id
                select new ChapterWithInstructor(chapter, course.InstructorId)
            )
            .FirstOrDefaultAsync(ct);

        if (item == null)
        {
            throw new EntityNotFoundException(nameof(Chapter), request.Id);
        }

        bool isAdmin = IsInRole(Roles.Admin);
        bool isInstructor = IsInRole(Roles.Instructor);
        bool canDelete = isAdmin || (isInstructor && item.InstructorId == CurrentUserId);
        if (!canDelete)
        {
            throw new UnauthorizedAccessException();
        }

        DbContext.Chapters.Remove(item.Chapter);
        return Unit.Value;
    }

    private sealed record ChapterWithInstructor(Chapter Chapter, Guid InstructorId);
}