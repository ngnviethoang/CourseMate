using CourseMate.Application.Queries.Notifications;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Queries.Notifications;

public class GetUnreadCountQueryHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldReturnCorrectUnreadCount()
    {
        GetUnreadCountQueryHandler handler = new(_testContainer.ReadOnlyDbContext, _testContainer.HttpContextAccessor);

        GetUnreadCountResponse result = await handler.Handle(new GetUnreadCountQuery(), CancellationToken.None);

        Assert.Equal(2, result.Count);
    }

    [Fact]
    public async Task Handle_ShouldReturnZero_WhenAllNotificationsRead()
    {
        Guid userId = Guid.NewGuid();
        TestDbContextScope scope = new(userId, Roles.Student);
        CourseMateDbContext dbContext = scope.CreateWriteDbContext();
        dbContext.Notifications.Add(new Notification(Guid.NewGuid(), userId, "Read", "msg", true));
        await dbContext.SaveChangesAsync();

        GetUnreadCountQueryHandler handler = new(scope.CreateReadOnlyDbContext(), scope.HttpContextAccessor);

        GetUnreadCountResponse result = await handler.Handle(new GetUnreadCountQuery(), CancellationToken.None);

        Assert.Equal(0, result.Count);
    }

    [Fact]
    public async Task Handle_ShouldReturnZero_WhenNoNotifications()
    {
        Guid userId = Guid.NewGuid();
        TestDbContextScope scope = new(userId, Roles.Student);

        GetUnreadCountQueryHandler handler = new(scope.CreateReadOnlyDbContext(), scope.HttpContextAccessor);

        GetUnreadCountResponse result = await handler.Handle(new GetUnreadCountQuery(), CancellationToken.None);

        Assert.Equal(0, result.Count);
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

            dbContext.Notifications.Add(new Notification(Guid.NewGuid(), UserId, "Unread 1", "msg", false));
            dbContext.Notifications.Add(new Notification(Guid.NewGuid(), UserId, "Unread 2", "msg", false));
            dbContext.Notifications.Add(new Notification(Guid.NewGuid(), UserId, "Already Read", "msg", true));

            // Another user's unread notification - should not be counted
            dbContext.Notifications.Add(new Notification(Guid.NewGuid(), Guid.NewGuid(), "Other User", "msg", false));

            dbContext.SaveChanges();
        }
    }
}