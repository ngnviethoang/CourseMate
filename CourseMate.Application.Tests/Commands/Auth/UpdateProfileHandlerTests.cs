using CourseMate.Application.Commands.Auth;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace CourseMate.Application.Tests.Commands.Auth;

public class UpdateProfileHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldUpdateUsername_WhenValidNewUsernameProvided()
    {
        UpdateProfileHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.UserManager.Object);

        UpdateProfileCommand request = new()
        {
            UserName = "newusername"
        };

        Unit result = await handler.Handle(request, CancellationToken.None);

        Assert.Equal(Unit.Value, result);
        _testContainer.UserManager.Verify(
            m => m.UpdateAsync(It.Is<User>(u => u.UserName == "newusername" && u.NormalizedUserName == "NEWUSERNAME")),
            Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldUpdateEmail_WhenValidNewEmailProvided()
    {
        UpdateProfileHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.UserManager.Object);

        UpdateProfileCommand request = new()
        {
            Email = "newemail@example.com"
        };

        Unit result = await handler.Handle(request, CancellationToken.None);

        Assert.Equal(Unit.Value, result);
        _testContainer.UserManager.Verify(
            m => m.UpdateAsync(It.Is<User>(u =>
                u.Email == "newemail@example.com" &&
                u.NormalizedEmail == "NEWEMAIL@EXAMPLE.COM" &&
                !u.EmailConfirmed)),
            Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldUpdatePhoneNumber_WhenValidPhoneNumberProvided()
    {
        UpdateProfileHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.UserManager.Object);

        UpdateProfileCommand request = new()
        {
            PhoneNumber = "+84912345678"
        };

        Unit result = await handler.Handle(request, CancellationToken.None);

        Assert.Equal(Unit.Value, result);
        _testContainer.UserManager.Verify(
            m => m.UpdateAsync(It.Is<User>(u =>
                u.PhoneNumber == "+84912345678" &&
                !u.PhoneNumberConfirmed)),
            Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldUpdateMultipleFields_WhenMultipleFieldsProvided()
    {
        UpdateProfileHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.UserManager.Object);

        UpdateProfileCommand request = new()
        {
            UserName = "newusername",
            Email = "newemail@example.com",
            PhoneNumber = "+84912345678"
        };

        Unit result = await handler.Handle(request, CancellationToken.None);

        Assert.Equal(Unit.Value, result);
        _testContainer.UserManager.Verify(
            m => m.UpdateAsync(It.Is<User>(u =>
                u.UserName == "newusername" &&
                u.Email == "newemail@example.com" &&
                u.PhoneNumber == "+84912345678")),
            Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldThrowEntityNotFoundException_WhenUserNotFound()
    {
        TestDbContextScope scope = new(Guid.NewGuid(), "Student");
        UpdateProfileHandler handler = new(
            scope.CreateWriteDbContext(),
            scope.HttpContextAccessor,
            _testContainer.UserManager.Object);

        UpdateProfileCommand request = new()
        {
            UserName = "newusername"
        };

        EntityNotFoundException exception = await Assert.ThrowsAsync<EntityNotFoundException>(() => handler.Handle(request, CancellationToken.None));

        Assert.Contains("not found", exception.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task Handle_ShouldThrowBusinessException_WhenUpdateFails()
    {
        UpdateProfileHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.UserManagerWithFailure.Object);

        UpdateProfileCommand request = new()
        {
            UserName = "newusername"
        };

        BusinessException exception = await Assert.ThrowsAsync<BusinessException>(() => handler.Handle(request, CancellationToken.None));

        Assert.Equal(ErrorCode.Unknown, exception.ErrorCode);
    }

    [Fact]
    public async Task Handle_ShouldNotUpdateField_WhenFieldIsSameAsCurrent()
    {
        UpdateProfileHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.UserManager.Object);

        UpdateProfileCommand request = new()
        {
            UserName = _testContainer.TestUser.UserName
        };

        Unit result = await handler.Handle(request, CancellationToken.None);

        Assert.Equal(Unit.Value, result);
    }

    private sealed class TestContainer
    {
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly User TestUser;
        public readonly Guid UserId = Guid.NewGuid();
        public readonly Mock<UserManager<User>> UserManager;
        public readonly Mock<UserManager<User>> UserManagerWithFailure;

        public TestContainer()
        {
            TestDbContextScope scope = new(UserId, "Student");
            HttpContextAccessor = scope.HttpContextAccessor;
            DbContext = scope.CreateWriteDbContext();

            TestUser = new User("testuser")
            {
                Email = "test@example.com",
                PhoneNumber = "+84987654321"
            };

            DbContext.Users.Add(TestUser);
            DbContext.SaveChanges();

            UserManager = new Mock<UserManager<User>>(
                new Mock<IUserStore<User>>().Object, null, null, null, null, null, null, null, null);

            UserManager
                .Setup(m => m.FindByIdAsync(UserId.ToString()))
                .ReturnsAsync(TestUser);
            UserManager
                .Setup(m => m.UpdateAsync(It.IsAny<User>()))
                .ReturnsAsync(IdentityResult.Success);

            UserManagerWithFailure = new Mock<UserManager<User>>(
                new Mock<IUserStore<User>>().Object, null, null, null, null, null, null, null, null);

            UserManagerWithFailure
                .Setup(m => m.FindByIdAsync(UserId.ToString()))
                .ReturnsAsync(TestUser);
            UserManagerWithFailure
                .Setup(m => m.UpdateAsync(It.IsAny<User>()))
                .ReturnsAsync(IdentityResult.Failed(
                    new IdentityError { Code = "DuplicateUserName", Description = "Username is already taken." }));
        }
    }
}