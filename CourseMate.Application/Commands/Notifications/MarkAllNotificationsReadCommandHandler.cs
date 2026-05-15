using CourseMate.Application.Shared;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Notifications;

public class MarkAllNotificationsReadCommand : IRequest<int>
{
}

internal sealed class MarkAllNotificationsReadCommandHandler : AbstractCommandHandler<MarkAllNotificationsReadCommand, int>
{
    public MarkAllNotificationsReadCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(MarkAllNotificationsReadCommand request, CancellationToken ct)
    {
        int count = await DbContext.Notifications
            .Where(n => n.ReceiverId == CurrentUserId && !n.IsRead)
            .ExecuteUpdateAsync(s => s.SetProperty(n => n.IsRead, true), ct);

        return count;
    }
}