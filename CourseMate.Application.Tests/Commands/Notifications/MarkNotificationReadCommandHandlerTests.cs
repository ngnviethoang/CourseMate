using CourseMate.Application.Commands.Notifications;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Commands.Notifications;

public class MarkNotificationReadCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldMarkNotificationRead_WhenOwnerMarksNotification()
    {
        MarkNotificationReadCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);

        MarkNotificationReadCommand request = new() { NotificationId = _testContainer.NotificationId };

        ResultIdDto result = await handler.Handle(request, CancellationToken.None);

        Assert.Equal(_testContainer.NotificationId, result.Id);

        Notification? updated = await _testContainer.DbContext.Notifications.FindAsync(_testContainer.NotificationId);
        Assert.NotNull(updated);
        Assert.True(updated.IsRead);
    }

    [Fact]
    public async Task Handle_ShouldThrowKeyNotFoundException_WhenNotificationNotFound()
    {
        MarkNotificationReadCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);

        MarkNotificationReadCommand request = new() { NotificationId = Guid.NewGuid() };

        await Assert.ThrowsAsync<KeyNotFoundException>(() => handler.Handle(request, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_ShouldThrowKeyNotFoundException_WhenOtherUserTriesToMarkNotification()
    {
        Guid otherUserId = Guid.NewGuid();
        TestDbContextScope otherScope = new(otherUserId, Roles.Student);
        CourseMateDbContext otherDbContext = otherScope.CreateWriteDbContext();

        otherDbContext.Notifications.Add(new Notification(
            _testContainer.NotificationId,
            _testContainer.UserId,
            "Test",
            "Message",
            false));
        await otherDbContext.SaveChangesAsync();

        MarkNotificationReadCommandHandler handler = new(otherDbContext, otherScope.HttpContextAccessor);

        MarkNotificationReadCommand request = new() { NotificationId = _testContainer.NotificationId };

        // Other user's context - notification belongs to _testContainer.UserId, not otherUserId
        await Assert.ThrowsAsync<KeyNotFoundException>(() => handler.Handle(request, CancellationToken.None));
    }

    private sealed class TestContainer
    {
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid NotificationId = Guid.NewGuid();
        public readonly Guid UserId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope scope = new(UserId, Roles.Student);
            HttpContextAccessor = scope.HttpContextAccessor;
            DbContext = scope.CreateWriteDbContext();

            DbContext.Notifications.Add(new Notification(
                NotificationId,
                UserId,
                "Welcome",
                "You have a new notification",
                false));

            DbContext.SaveChanges();
        }
    }
}