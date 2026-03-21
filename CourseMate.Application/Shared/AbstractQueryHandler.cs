using CourseMate.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Http;

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
}

public abstract class AbstractQueryHandler<TRequest> : AbstractRequestHandler, IRequestHandler<TRequest>
    where TRequest : IRequest
{
    protected readonly CourseMateReadOnlyDbContext DbContext;

    protected AbstractQueryHandler(
        CourseMateReadOnlyDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
    {
        DbContext = dbContext;
    }

    public abstract Task Handle(TRequest request, CancellationToken cancellationToken);
}