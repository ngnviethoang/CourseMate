using CourseMate.Application.Queries.Chats;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Chat;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Queries.Chats;

public class GetChatMessagesQueryHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldReturnMessagesOrderedByCreation_WhenUserOwnsConversation()
    {
        GetChatMessagesQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        PagedDto<ChatMessageDto> result = await handler.Handle(
            new GetChatMessagesQuery { ConversationId = _testContainer.OwnedConversationId, PageIndex = 1, PageSize = 50 },
            CancellationToken.None);

        Assert.Equal(2, result.Items.Count());
        Assert.Equal(ChatRole.User, result.Items.First().Role);
    }

    [Fact]
    public async Task Handle_ShouldReturnEmpty_WhenUserDoesNotOwnConversation()
    {
        GetChatMessagesQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        PagedDto<ChatMessageDto> result = await handler.Handle(
            new GetChatMessagesQuery { ConversationId = _testContainer.OtherConversationId, PageIndex = 1, PageSize = 50 },
            CancellationToken.None);

        Assert.Empty(result.Items);
    }

    private sealed class TestContainer
    {
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid OtherConversationId = Guid.NewGuid();
        public readonly Guid OwnedConversationId = Guid.NewGuid();
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;
        public readonly Guid UserId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope scope = new(UserId, Roles.Student);
            HttpContextAccessor = scope.HttpContextAccessor;
            DbContext = scope.CreateWriteDbContext();
            ReadOnlyDbContext = scope.CreateReadOnlyDbContext();

            DbContext.ChatConversations.Add(new ChatConversation(OwnedConversationId, UserId, "Mine", null, null));
            DbContext.ChatConversations.Add(new ChatConversation(OtherConversationId, Guid.NewGuid(), "Other", null, null));
            DbContext.ChatMessages.AddRange(
                new ChatMessage(Guid.NewGuid(), OwnedConversationId, ChatRole.User, "Question", null),
                new ChatMessage(Guid.NewGuid(), OwnedConversationId, ChatRole.Assistant, "Answer", null),
                new ChatMessage(Guid.NewGuid(), OtherConversationId, ChatRole.User, "Secret", null));
            DbContext.SaveChanges();
        }
    }
}