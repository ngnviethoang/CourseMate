using CourseMate.Application.Services.AIServices;
using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Chat;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace CourseMate.Application.Commands.Chats;

public class SendChatMessageCommand : IRequest<ChatAnswerDto>
{
    public Guid? ConversationId { get; set; }
    public Guid? CourseId { get; set; }
    public Guid? LessonId { get; set; }
    public string Text { get; set; } = string.Empty;

    /// <summary>
    ///     Resolved by the SignalR hub (which has no HttpContext). Ignored on the REST path,
    ///     where the handler falls back to the authenticated user from the request context.
    /// </summary>
    [JsonIgnore]
    public Guid UserId { get; set; }
}

public sealed class SendChatMessageCommandHandler : AbstractCommandHandler<SendChatMessageCommand, ChatAnswerDto>
{
    private const int TopK = 5;
    private const int HistoryWindow = 6;
    private const int TitleMaxLength = 100;

    private readonly IAiService _aiService;
    private readonly IChatRetrievalService _retrievalService;

    public SendChatMessageCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor,
        IAiService aiService,
        IChatRetrievalService retrievalService)
        : base(dbContext, httpContextAccessor)
    {
        _aiService = aiService;
        _retrievalService = retrievalService;
    }

    public override async Task<ChatAnswerDto> Handle(SendChatMessageCommand request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Text))
        {
            throw new BusinessException(ErrorCode.Unknown, "Message text is required.");
        }

        Guid userId = request.UserId != Guid.Empty ? request.UserId : CurrentUserId;
        ChatConversation conversation = await GetOrCreateConversationAsync(request, userId, ct);

        List<ChatTurn> history = await DbContext.ChatMessages
            .Where(m => m.ConversationId == conversation.Id)
            .OrderByDescending(m => m.CreationTime)
            .Take(HistoryWindow)
            .OrderBy(m => m.CreationTime)
            .Select(m => new ChatTurn(m.Role, m.Content))
            .ToListAsync(ct);

        ChatMessage userMessage = new(Guid.NewGuid(), conversation.Id, ChatRole.User, request.Text, null);
        await DbContext.ChatMessages.AddAsync(userMessage, ct);

        ReadOnlyMemory<float> queryVector = await _aiService.GenerateVectorAsync(request.Text, ct);
        IReadOnlyList<RetrievedChunk> chunks = await _retrievalService.RetrieveAsync(
            queryVector, conversation.CourseId, conversation.LessonId, TopK, ct);

        string context = string.Join("\n---\n", chunks.Select(c => c.Text));
        string answer = await _aiService.ChatAsync(history, context, request.Text, ct);

        string? sourceChunkIds = chunks.Count > 0
            ? string.Join(",", chunks.Select(c => c.FileChunkId))
            : null;

        ChatMessage assistantMessage = new(Guid.NewGuid(), conversation.Id, ChatRole.Assistant, answer, sourceChunkIds);
        await DbContext.ChatMessages.AddAsync(assistantMessage, ct);

        return new ChatAnswerDto
        {
            ConversationId = conversation.Id,
            MessageId = assistantMessage.Id,
            Answer = answer,
            Sources = chunks.Select(c => new ChatSourceDto
            {
                FileChunkId = c.FileChunkId,
                FileEntryId = c.FileEntryId,
                ShortText = c.ShortText
            }).ToList()
        };
    }

    private async Task<ChatConversation> GetOrCreateConversationAsync(SendChatMessageCommand request, Guid userId, CancellationToken ct)
    {
        if (request.ConversationId.HasValue)
        {
            ChatConversation? existing = await DbContext.ChatConversations
                .FirstOrDefaultAsync(c => c.Id == request.ConversationId.Value, ct);
            if (existing == null)
            {
                throw new BusinessException(ErrorCode.ChatConversationNotFound, "Conversation was not found.");
            }

            if (existing.UserId != userId)
            {
                throw new BusinessException(ErrorCode.ChatAccessDenied, "You do not have access to this conversation.");
            }

            return existing;
        }

        string title = request.Text.Length > TitleMaxLength ? request.Text[..TitleMaxLength] : request.Text;
        ChatConversation conversation = new(Guid.NewGuid(), userId, title, request.CourseId, request.LessonId);
        await DbContext.ChatConversations.AddAsync(conversation, ct);
        return conversation;
    }
}
