using CourseMate.Application.Commands.Auth;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace CourseMate.Application.Tests.Commands.Auth;

public class ForgotPasswordCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    public ForgotPasswordCommandHandlerTests()
    {
        HangfireTestSetup.Initialize();
    }

    [Fact]
    public async Task Handle_ShouldReturnUnit_WhenUserDoesNotExist()
    {
        ForgotPasswordCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.UserManager,
            _testContainer.Configuration);

        ForgotPasswordCommand request = new() { Email = "nonexistent@example.com" };

        // Should return Unit without throwing (no user enumeration)
        Unit result = await handler.Handle(request, CancellationToken.None);

        Assert.Equal(Unit.Value, result);
    }

    [Fact]
    public async Task Handle_ShouldReturnUnit_WhenUserEmailNotConfirmed()
    {
        User user = new("unverified") { Email = "unverified@example.com", EmailConfirmed = false };
        await _testContainer.UserManager.CreateAsync(user, "ValidPassword123!");

        ForgotPasswordCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.UserManager,
            _testContainer.Configuration);

        ForgotPasswordCommand request = new() { Email = "unverified@example.com" };

        // Returns Unit early since email is not confirmed
        Unit result = await handler.Handle(request, CancellationToken.None);

        Assert.Equal(Unit.Value, result);
    }

    private sealed class TestContainer
    {
        public readonly IConfiguration Configuration;
        public readonly CourseMateDbContext DbContext;
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly UserManager<User> UserManager;

        public TestContainer()
        {
            TestDbContextScope scope = new(Guid.NewGuid(), Roles.Student);
            HttpContextAccessor = scope.HttpContextAccessor;
            DbContext = scope.CreateWriteDbContext();
            UserManager = scope.GetUserManager();
            Configuration = scope.GetConfiguration();
        }
    }
}