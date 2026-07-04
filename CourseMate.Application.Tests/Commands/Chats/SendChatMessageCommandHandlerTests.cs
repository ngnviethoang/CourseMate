using CourseMate.Application.Commands.Chats;
using CourseMate.Application.Services.AIServices;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Chat;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace CourseMate.Application.Tests.Commands.Chats;

public class SendChatMessageCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldCreateConversationAndPersistBothMessages_WhenConversationIdIsNull()
    {
        SendChatMessageCommandHandler handler = _testContainer.CreateHandler();
        SendChatMessageCommand request = new() { Text = "What is recursion?" };

        ChatAnswerDto result = await handler.Handle(request, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();

        Assert.Equal("Generated answer", result.Answer);
        Assert.Single(await _testContainer.DbContext.ChatConversations.ToListAsync());
        List<ChatMessage> messages = await _testContainer.DbContext.ChatMessages.OrderBy(m => m.CreationTime).ToListAsync();
        Assert.Equal(2, messages.Count);
        Assert.Equal(ChatRole.User, messages[0].Role);
        Assert.Equal(ChatRole.Assistant, messages[1].Role);
    }

    [Fact]
    public async Task Handle_ShouldThrowChatAccessDenied_WhenConversationBelongsToAnotherUser()
    {
        Guid otherConversationId = Guid.NewGuid();
        _testContainer.DbContext.ChatConversations.Add(
            new ChatConversation(otherConversationId, Guid.NewGuid(), "Other", null, null));
        await _testContainer.DbContext.SaveChangesAsync();
        SendChatMessageCommandHandler handler = _testContainer.CreateHandler();
        SendChatMessageCommand request = new() { ConversationId = otherConversationId, Text = "Hello" };

        BusinessException exception = await Assert.ThrowsAsync<BusinessException>(() => handler.Handle(request, CancellationToken.None));
        Assert.Equal(ErrorCode.ChatAccessDenied, exception.ErrorCode);
    }

    [Fact]
    public async Task Handle_ShouldThrowChatConversationNotFound_WhenConversationDoesNotExist()
    {
        SendChatMessageCommandHandler handler = _testContainer.CreateHandler();
        SendChatMessageCommand request = new() { ConversationId = Guid.NewGuid(), Text = "Hello" };

        BusinessException exception = await Assert.ThrowsAsync<BusinessException>(() => handler.Handle(request, CancellationToken.None));
        Assert.Equal(ErrorCode.ChatConversationNotFound, exception.ErrorCode);
    }

    [Fact]
    public async Task Handle_ShouldThrow_WhenTextIsEmpty()
    {
        SendChatMessageCommandHandler handler = _testContainer.CreateHandler();
        SendChatMessageCommand request = new() { Text = "   " };

        await Assert.ThrowsAsync<BusinessException>(() => handler.Handle(request, CancellationToken.None));
    }

    private sealed class TestContainer
    {
        private readonly Mock<IAiService> _aiService = new();
        private readonly Mock<IChatRetrievalService> _retrievalService = new();
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid UserId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope scope = new(UserId, Roles.Student);
            HttpContextAccessor = scope.HttpContextAccessor;
            DbContext = scope.CreateWriteDbContext();

            _aiService.Setup(s => s.GenerateVectorAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new ReadOnlyMemory<float>(new float[768]));
            _aiService.Setup(s => s.ChatAsync(
                    It.IsAny<IReadOnlyList<ChatTurn>>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync("Generated answer");
            _retrievalService.Setup(s => s.RetrieveAsync(
                    It.IsAny<ReadOnlyMemory<float>>(), It.IsAny<Guid?>(), It.IsAny<Guid?>(), It.IsAny<int>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync([]);
        }

        public SendChatMessageCommandHandler CreateHandler()
        {
            return new SendChatMessageCommandHandler(DbContext, HttpContextAccessor, _aiService.Object, _retrievalService.Object);
        }
    }
}