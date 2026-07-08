using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Chat;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Chats;

public class GetListChatConversationsQuery : GetListQuery<ChatConversationDto>;

public sealed class GetListChatConversationsQueryHandler : AbstractQueryHandler<GetListChatConversationsQuery, PagedDto<ChatConversationDto>>
{
    public GetListChatConversationsQueryHandler(
        CourseMateReadOnlyDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<ChatConversationDto>> Handle(GetListChatConversationsQuery request, CancellationToken ct)
    {
        Guid userId = CurrentUserId;
        IQueryable<ChatConversationDto> query = DbContext.ChatConversations
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.CreationTime)
            .Select(c => new ChatConversationDto
            {
                Id = c.Id,
                Title = c.Title,
                CourseId = c.CourseId,
                LessonId = c.LessonId,
                CreatedAt = c.CreationTime
            });

        int totalCount = await query.CountAsync(ct);
        List<ChatConversationDto> items = await query.Paged(request.PageIndex, request.PageSize).ToListAsync(ct);

        return new PagedDto<ChatConversationDto>
        {
            Items = items,
            TotalCount = totalCount,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize
        };
    }
}