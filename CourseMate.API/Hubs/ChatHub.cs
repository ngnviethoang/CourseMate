using System.Security.Claims;
using CourseMate.Application.Commands.Chats;
using CourseMate.Contracts.DTOs.Chat;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace CourseMate.API.Hubs;

[Authorize]
public class ChatHub : Hub
{
    private readonly IMediator _mediator;

    public ChatHub(IMediator mediator)
    {
        _mediator = mediator;
    }

    public async Task SendMessage(SendChatMessageRequest request)
    {
        await Clients.Caller.SendAsync("ReceiveStart", request.ConversationId);

        SendChatMessageCommand command = new()
        {
            ConversationId = request.ConversationId,
            CourseId = request.CourseId,
            LessonId = request.LessonId,
            Text = request.Text,
            UserId = GetCurrentUserId() // Hub has no HttpContext; resolve from Context.User
        };

        ChatAnswerDto result = await _mediator.Send(command);
        await Clients.Caller.SendAsync("ReceiveMessageComplete", result);
    }

    private Guid GetCurrentUserId()
    {
        string? userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(userId, out Guid id) ? id : Guid.Empty;
    }
}