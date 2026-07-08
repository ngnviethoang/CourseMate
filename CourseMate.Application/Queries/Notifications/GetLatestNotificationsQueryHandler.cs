using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using CourseMate.Persistent.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Notifications;

public class GetLatestNotificationsQuery : GetListQuery<NotificationDto>
{
    public Guid UserId { get; set; }
}

public sealed class GetLatestNotificationsQueryHandler : AbstractQueryHandler<GetLatestNotificationsQuery, PagedDto<NotificationDto>>
{
    public GetLatestNotificationsQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<NotificationDto>> Handle(GetLatestNotificationsQuery request, CancellationToken ct)
    {
        if (IsInRole(Roles.Student) || IsInRole(Roles.Instructor))
        {
            if (CurrentUserId != request.UserId)
            {
                throw new UnauthorizedAccessException();
            }
        }

        IQueryable<Notification> query = DbContext.Notifications
            .Where(n => n.ReceiverId == request.UserId);

        int totalCount = await query.CountAsync(ct);

        List<NotificationDto> notifications = await query
            .OrderByDescending(n => n.CreationTime)
            .Paged(request.PageIndex, request.PageSize)
            .Select(n => new NotificationDto
            {
                Id = n.Id,
                ReceiverId = n.ReceiverId,
                Title = n.Title,
                Message = n.Message,
                IsRead = n.IsRead,
                CreationTime = n.CreationTime
            })
            .ToListAsync(ct);

        return new PagedDto<NotificationDto>
        {
            Items = notifications,
            TotalCount = totalCount,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize
        };
    }
}