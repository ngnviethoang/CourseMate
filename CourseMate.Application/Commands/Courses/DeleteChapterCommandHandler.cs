using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Courses;

public class DeleteChapterCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}

public sealed class DeleteChapterAbstractCommandHandler : AbstractCommandHandler<DeleteChapterCommand, Unit>
{
    public DeleteChapterAbstractCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<Unit> Handle(DeleteChapterCommand request, CancellationToken ct)
    {
        Guid userId = CurrentUserId;
        bool canDelete = await (
                from chapter in DbContext.Chapters
                join course in DbContext.Courses
                    on chapter.CourseId equals course.Id
                where chapter.Id == request.Id
                select new { chapter, course }
            )
            .WhereIf(IsInRole(Roles.Instructor), x => x.course.InstructorId == userId)
            .AnyAsync(ct);

        if (!canDelete)
        {
            throw new UnauthorizedAccessException();
        }

        await DbContext.Chapters.RemoveByIdAsync(request.Id, ct);
        return Unit.Value;
    }
}