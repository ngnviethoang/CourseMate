using CourseMate.Application.Commands.Chats;
using CourseMate.Application.Queries.Chats;
using CourseMate.Contracts.DTOs.Chat;
using CourseMate.Contracts.DTOs.Commons;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseMate.API.Controllers;

[ApiController]
[Route("api/chat")]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly IMediator _mediator;

    public ChatController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("messages")]
    public async Task<ActionResult> CreateChatMessage(SendChatMessageCommand request)
    {
        ChatAnswerDto result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpPost("conversations")]
    public async Task<ActionResult> CreateChatConversation(CreateChatConversationCommand request)
    {
        Guid result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("conversations")]
    public async Task<ActionResult> GetListChatConversations([FromQuery] GetListChatConversationsQuery request)
    {
        PagedDto<ChatConversationDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpGet("conversations/{id:guid}/messages")]
    public async Task<ActionResult> GetListChatMessages(Guid id, [FromQuery] GetChatMessagesQuery request)
    {
        request.ConversationId = id;
        PagedDto<ChatMessageDto> result = await _mediator.Send(request);
        return Ok(result);
    }

    [HttpDelete("conversations/{id:guid}")]
    public async Task<ActionResult> DeleteChatConversation(Guid id)
    {
        await _mediator.Send(new DeleteChatConversationCommand { Id = id });
        return NoContent();
    }
}
