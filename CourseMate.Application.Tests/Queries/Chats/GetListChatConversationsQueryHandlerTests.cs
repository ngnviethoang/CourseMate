using CourseMate.Application.Queries.Chats;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Chat;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Queries.Chats;

public class GetListChatConversationsQueryHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldReturnOnlyCurrentUserConversations_WhenQuerying()
    {
        GetListChatConversationsQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        PagedDto<ChatConversationDto> result = await handler.Handle(
            new GetListChatConversationsQuery { PageIndex = 1, PageSize = 50 }, CancellationToken.None);

        Assert.Equal(2, result.Items.Count());
        Assert.All(result.Items, conversation => Assert.Contains(conversation.Title, new[] { "First", "Second" }));
    }

    private sealed class TestContainer
    {
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;
        public readonly Guid UserId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope scope = new(UserId, Roles.Student);
            HttpContextAccessor = scope.HttpContextAccessor;
            DbContext = scope.CreateWriteDbContext();
            ReadOnlyDbContext = scope.CreateReadOnlyDbContext();

            DbContext.ChatConversations.AddRange(
                new ChatConversation(Guid.NewGuid(), UserId, "First", null, null),
                new ChatConversation(Guid.NewGuid(), UserId, "Second", null, null),
                new ChatConversation(Guid.NewGuid(), Guid.NewGuid(), "Stranger", null, null));
            DbContext.SaveChanges();
        }
    }
}