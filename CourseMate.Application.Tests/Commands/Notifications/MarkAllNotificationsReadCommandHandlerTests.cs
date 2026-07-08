using CourseMate.Application.Commands.Notifications;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Commands.Notifications;

public class MarkAllNotificationsReadCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldMarkAllUnreadNotifications_WhenUserHasUnread()
    {
        MarkAllNotificationsReadCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);

        MarkAllNotificationsReadCommand request = new();

        MarkAllNotificationsReadResponse result = await handler.Handle(request, CancellationToken.None);

        Assert.Equal(2, result.Count);
    }

    [Fact]
    public async Task Handle_ShouldReturnZero_WhenAllNotificationsAlreadyRead()
    {
        TestDbContextScope scope = new(Guid.NewGuid(), Roles.Student);
        CourseMateDbContext dbContext = scope.CreateWriteDbContext();
        Guid userId = Guid.NewGuid();
        dbContext.Notifications.Add(new Notification(Guid.NewGuid(), userId, "Read One", "msg", true));
        await dbContext.SaveChangesAsync();

        // Use same scope but with the right userId
        TestDbContextScope userScope = new(userId, Roles.Student);
        CourseMateDbContext userDbContext = userScope.CreateWriteDbContext();
        userDbContext.Notifications.Add(new Notification(Guid.NewGuid(), userId, "Read Two", "msg", true));
        await userDbContext.SaveChangesAsync();

        MarkAllNotificationsReadCommandHandler handler = new(userDbContext, userScope.HttpContextAccessor);

        MarkAllNotificationsReadResponse result = await handler.Handle(new MarkAllNotificationsReadCommand(), CancellationToken.None);

        Assert.Equal(0, result.Count);
    }

    [Fact]
    public async Task Handle_ShouldOnlyMarkCurrentUsersNotifications()
    {
        MarkAllNotificationsReadCommandHandler handler = new(_testContainer.DbContext, _testContainer.HttpContextAccessor);

        MarkAllNotificationsReadResponse result = await handler.Handle(new MarkAllNotificationsReadCommand(), CancellationToken.None);

        // Only 2 unread belong to TestContainer.UserId (other user's notifications are not affected)
        Assert.Equal(2, result.Count);
    }

    private sealed class TestContainer
    {
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid UserId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope scope = new(UserId, Roles.Student);
            HttpContextAccessor = scope.HttpContextAccessor;
            DbContext = scope.CreateWriteDbContext();

            DbContext.Notifications.Add(new Notification(Guid.NewGuid(), UserId, "Notification 1", "message 1", false));
            DbContext.Notifications.Add(new Notification(Guid.NewGuid(), UserId, "Notification 2", "message 2", false));
            DbContext.Notifications.Add(new Notification(Guid.NewGuid(), UserId, "Already Read", "message 3", true));

            // Another user's notification
            Guid otherUserId = Guid.NewGuid();
            DbContext.Notifications.Add(new Notification(Guid.NewGuid(), otherUserId, "Other User", "message", false));

            DbContext.SaveChanges();
        }
    }
}