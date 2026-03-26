using CourseMate.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Http;

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
}