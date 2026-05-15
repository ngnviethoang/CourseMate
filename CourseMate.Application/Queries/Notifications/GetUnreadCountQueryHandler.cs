using CourseMate.Application.Shared;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Notifications;

public class GetUnreadCountQuery : IRequest<int>
{
}

internal sealed class GetUnreadCountQueryHandler : AbstractQueryHandler<GetUnreadCountQuery, int>
{
    public GetUnreadCountQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(GetUnreadCountQuery request, CancellationToken ct)
    {
        return await DbContext.Notifications
            .CountAsync(n => n.ReceiverId == CurrentUserId && !n.IsRead, ct);
    }
}