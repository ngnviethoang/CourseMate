using CourseMate.Application.Queries.Notifications;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseMate.API.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationController : ControllerBase
{
    private readonly IMediator _mediator;

    public NotificationController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult> GetNotifications([FromQuery] GetLatestNotificationsQuery request)
    {
        PagedDto<NotificationDto> result = await _mediator.Send(request);
        return Ok(result);
    }
}