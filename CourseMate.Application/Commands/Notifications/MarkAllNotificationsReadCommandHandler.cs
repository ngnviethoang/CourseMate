using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Notifications;

public class MarkAllNotificationsReadCommand : IRequest<MarkAllNotificationsReadResponse>;

internal sealed class MarkAllNotificationsReadCommandHandler : AbstractCommandHandler<MarkAllNotificationsReadCommand, MarkAllNotificationsReadResponse>
{
    public MarkAllNotificationsReadCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<MarkAllNotificationsReadResponse> Handle(MarkAllNotificationsReadCommand request, CancellationToken ct)
    {
        List<Notification> notifications = await DbContext.Notifications
            .Where(n => n.ReceiverId == CurrentUserId && !n.IsRead)
            .ToListAsync(ct);

        notifications.ForEach(n => n.IsRead = true);
        return new MarkAllNotificationsReadResponse
        {
            Count = notifications.Count
        };
    }
}