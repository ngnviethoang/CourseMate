using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Chat;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Chats;

public class GetChatMessagesQuery : GetListQuery<ChatMessageDto>
{
    public Guid ConversationId { get; set; }
}

public sealed class GetChatMessagesQueryHandler : AbstractQueryHandler<GetChatMessagesQuery, PagedDto<ChatMessageDto>>
{
    public GetChatMessagesQueryHandler(
        CourseMateReadOnlyDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<ChatMessageDto>> Handle(GetChatMessagesQuery request, CancellationToken ct)
    {
        Guid userId = CurrentUserId;
        bool isOwner = await DbContext.ChatConversations
            .AnyAsync(c => c.Id == request.ConversationId && c.UserId == userId, ct);
        if (!isOwner)
        {
            return new PagedDto<ChatMessageDto>
            {
                Items = [],
                TotalCount = 0,
                PageIndex = request.PageIndex,
                PageSize = request.PageSize
            };
        }

        IQueryable<ChatMessageDto> query = DbContext.ChatMessages
            .Where(m => m.ConversationId == request.ConversationId)
            .OrderBy(m => m.CreationTime)
            .Select(m => new ChatMessageDto
            {
                Id = m.Id,
                ConversationId = m.ConversationId,
                Role = m.Role,
                Content = m.Content,
                CreatedAt = m.CreationTime
            });

        int totalCount = await query.CountAsync(ct);
        List<ChatMessageDto> items = await query.Paged(request.PageIndex, request.PageSize).ToListAsync(ct);

        return new PagedDto<ChatMessageDto>
        {
            Items = items,
            TotalCount = totalCount,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize
        };
    }
}