using CourseMate.Application.Shared;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Chats;

public class CreateChatConversationCommand : IRequest<Guid>
{
    public string Title { get; set; } = string.Empty;
    public Guid? CourseId { get; set; }
    public Guid? LessonId { get; set; }
}

public sealed class CreateChatConversationCommandHandler : AbstractCommandHandler<CreateChatConversationCommand, Guid>
{
    public CreateChatConversationCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<Guid> Handle(CreateChatConversationCommand request, CancellationToken ct)
    {
        string title = string.IsNullOrWhiteSpace(request.Title) ? "New conversation" : request.Title;
        ChatConversation conversation = new(Guid.NewGuid(), CurrentUserId, title, request.CourseId, request.LessonId);
        await DbContext.ChatConversations.AddAsync(conversation, ct);
        return conversation.Id;
    }
}
