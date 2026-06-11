using CourseMate.Application.Queries.Notifications;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Queries.Notifications;

public class GetLatestNotificationsQueryHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldReturnNotifications_WhenUserQueriesOwnNotifications()
    {
        GetLatestNotificationsQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        GetLatestNotificationsQuery query = new() { UserId = _testContainer.UserId };

        PagedDto<NotificationDto> result = await handler.Handle(query, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(3, result.TotalCount);
        Assert.All(result.Items, n => Assert.Equal(_testContainer.UserId, n.ReceiverId));
    }

    [Fact]
    public async Task Handle_ShouldThrowUnauthorizedAccessException_WhenStudentQueriesOtherUsersNotifications()
    {
        GetLatestNotificationsQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        GetLatestNotificationsQuery query = new() { UserId = Guid.NewGuid() };

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.Handle(query, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_ShouldReturnEmpty_WhenUserHasNoNotifications()
    {
        Guid newUserId = Guid.NewGuid();
        TestDbContextScope scope = new(newUserId, Roles.Student);

        GetLatestNotificationsQueryHandler handler = new(scope.CreateReadOnlyDbContext(), scope.HttpContextAccessor);

        GetLatestNotificationsQuery query = new() { UserId = newUserId };

        PagedDto<NotificationDto> result = await handler.Handle(query, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Empty(result.Items);
        Assert.Equal(0, result.TotalCount);
    }

    private sealed class TestContainer
    {
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;
        public readonly Guid UserId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope scope = new(UserId, Roles.Student);
            HttpContextAccessor = scope.HttpContextAccessor;
            CourseMateDbContext dbContext = scope.CreateWriteDbContext();
            ReadOnlyDbContext = scope.CreateReadOnlyDbContext();

            dbContext.Notifications.Add(new Notification(Guid.NewGuid(), UserId, "Notif 1", "msg 1", false));
            dbContext.Notifications.Add(new Notification(Guid.NewGuid(), UserId, "Notif 2", "msg 2", true));
            dbContext.Notifications.Add(new Notification(Guid.NewGuid(), UserId, "Notif 3", "msg 3", false));

            // Another user's notification
            dbContext.Notifications.Add(new Notification(Guid.NewGuid(), Guid.NewGuid(), "Other", "other msg", false));

            dbContext.SaveChanges();
        }
    }
}