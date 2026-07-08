using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Notifications;

public class GetUnreadCountQuery : IRequest<GetUnreadCountResponse>;

public sealed class GetUnreadCountQueryHandler : AbstractQueryHandler<GetUnreadCountQuery, GetUnreadCountResponse>
{
    public GetUnreadCountQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<GetUnreadCountResponse> Handle(GetUnreadCountQuery request, CancellationToken ct)
    {
        int count = await DbContext.Notifications.CountAsync(n => n.ReceiverId == CurrentUserId && !n.IsRead, ct);
        return new GetUnreadCountResponse
        {
            Count = count
        };
    }
}