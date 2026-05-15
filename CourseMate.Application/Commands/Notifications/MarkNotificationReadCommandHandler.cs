using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Notifications;

public class MarkNotificationReadCommand : IRequest<ResultIdDto>
{
    public Guid NotificationId { get; set; }
}

internal sealed class MarkNotificationReadCommandHandler : AbstractCommandHandler<MarkNotificationReadCommand, ResultIdDto>
{
    public MarkNotificationReadCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(MarkNotificationReadCommand request, CancellationToken ct)
    {
        Notification? notification = await DbContext.Notifications
            .FirstOrDefaultAsync(n => n.Id == request.NotificationId && n.ReceiverId == CurrentUserId, ct);

        if (notification == null)
        {
            throw new KeyNotFoundException("Notification not found.");
        }

        notification.IsRead = true;
        await DbContext.SaveChangesAsync(ct);

        return new ResultIdDto { Id = notification.Id };
    }
}