using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Shared;

public abstract class AbstractCommandHandler<TRequest, TResponse> : AbstractRequestHandler, IRequestHandler<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    protected readonly CourseMateDbContext DbContext;

    protected AbstractCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
    {
        DbContext = dbContext;
    }

    public abstract Task<TResponse> Handle(TRequest request, CancellationToken ct);

    protected async Task EnsureEnrollmentAsync(Guid courseId)
    {
        if (IsInRole(Roles.Student) && !await DbContext.Enrollments.AnyAsync(x => x.CourseId == courseId && x.StudentId == CurrentUserId))
        {
            throw new UnauthorizedAccessException();
        }
    }

    public async Task EnsureAuthorCourseAsync(Guid lessonId, CancellationToken ct)
    {
        if (!IsAuthenticated())
        {
            throw new UnauthorizedAccessException();
        }

        Lesson? lesson = await DbContext.Lessons.FirstOrDefaultAsync(l => l.Id == lessonId, ct);
        if (lesson == null)
        {
            throw new EntityNotFoundException(nameof(Lesson), lessonId);
        }

        if (IsInRole(Roles.Admin))
        {
            return;
        }

        if (IsInRole(Roles.Instructor))
        {
            bool hasAccess = await DbContext.Courses
                .Where(c => c.Id == lesson.CourseId)
                .AnyAsync(i => i.InstructorId == CurrentUserId, ct);
            if (hasAccess)
            {
                return;
            }
        }

        throw new UnauthorizedAccessException();
    }
}