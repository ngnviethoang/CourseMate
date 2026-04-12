using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Courses;

public class DeleteLessonCommand : IRequest<int>
{
    public Guid Id { get; set; }
}

internal sealed class DeleteLessonCommandHandler : AbstractCommandHandler<DeleteChapterCommand, int>
{
    public DeleteLessonCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(DeleteChapterCommand request, CancellationToken cancellationToken)
    {
        Guid userId = CurrentUserId;
        bool canDelete = await (
                from lesson in DbContext.Lessons
                join course in DbContext.Courses
                    on lesson.CourseId equals course.Id
                where lesson.Id == request.Id
                select new { lesson, course }
            )
            .WhereIf(IsInRole(Roles.Instructor), x => x.course.InstructorId == userId)
            .AnyAsync(cancellationToken);

        if (!canDelete)
        {
            throw new UnauthorizedAccessException();
        }

        await DbContext.Lessons.RemoveByIdAsync(request.Id, cancellationToken);
        return Codes.Success;
    }
}