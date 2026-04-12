using CourseMate.Contracts.Constants;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Shared;

public abstract class AbstractQueryHandler<TRequest, TResponse> : AbstractRequestHandler, IRequestHandler<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    protected readonly CourseMateReadOnlyDbContext DbContext;

    protected AbstractQueryHandler(
        CourseMateReadOnlyDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
    {
        DbContext = dbContext;
    }

    public abstract Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken);

    /// <summary>
    ///     Validates that a student user is enrolled in the specified course.
    /// </summary>
    protected async Task EnsureEnrollmentAsync(Guid courseId)
    {
        Guid userId = GetCurrentUserId();
        if (IsInRole(Roles.Student) && !await DbContext.Enrollments.AnyAsync(x => x.CourseId == courseId && x.StudentId == userId))
        {
            throw new UnauthorizedAccessException();
        }
    }
}