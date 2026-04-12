using CourseMate.Contracts.Constants;
using CourseMate.Persistent;
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

    public abstract Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken);

    protected async Task EnsureEnrollmentAsync(Guid courseId)
    {
        if (IsInRole(Roles.Student) && !await DbContext.Enrollments.AnyAsync(x => x.CourseId == courseId && x.StudentId == CurrentUserId))
        {
            throw new UnauthorizedAccessException();
        }
    }
}