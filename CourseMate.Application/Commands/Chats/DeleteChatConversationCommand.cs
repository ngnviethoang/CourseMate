using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Chats;

public class DeleteChatConversationCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}

public sealed class DeleteChatConversationCommandHandler : AbstractCommandHandler<DeleteChatConversationCommand, Unit>
{
    public DeleteChatConversationCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<Unit> Handle(DeleteChatConversationCommand request, CancellationToken ct)
    {
        ChatConversation? conversation = await DbContext.ChatConversations
            .FirstOrDefaultAsync(c => c.Id == request.Id, ct);
        if (conversation == null)
        {
            throw new BusinessException(ErrorCode.ChatConversationNotFound, "Conversation was not found.");
        }

        if (conversation.UserId != CurrentUserId)
        {
            throw new BusinessException(ErrorCode.ChatAccessDenied, "You do not have access to this conversation.");
        }

        List<ChatMessage> messages = await DbContext.ChatMessages
            .Where(m => m.ConversationId == request.Id)
            .ToListAsync(ct);
        DbContext.ChatMessages.RemoveRange(messages);
        DbContext.ChatConversations.Remove(conversation);
        return Unit.Value;
    }
}
