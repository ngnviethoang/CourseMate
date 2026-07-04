using System.Security.Claims;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.Tests.TestInfrastructure;

public sealed class TestDbContextScope
{
    private readonly string _databaseName = Guid.NewGuid().ToString("N");
    private readonly InMemoryDatabaseRoot _databaseRoot = new();

    public TestDbContextScope(Guid? userId = null, params string[] roles)
    {
        HttpContextAccessor = BuildHttpContextAccessor(userId, roles);
        EnsureRolesCreated();
    }

    public IHttpContextAccessor HttpContextAccessor { get; }

    public CourseMateDbContext CreateWriteDbContext()
    {
        DbContextOptions<CourseMateDbContext> options = new DbContextOptionsBuilder<CourseMateDbContext>()
            .UseInMemoryDatabase(_databaseName, _databaseRoot)
            .ReplaceService<IModelCustomizer, InMemoryTestModelCustomizer>()
            .Options;

        return new CourseMateDbContext(options, HttpContextAccessor);
    }

    public CourseMateReadOnlyDbContext CreateReadOnlyDbContext()
    {
        DbContextOptions<CourseMateReadOnlyDbContext> options = new DbContextOptionsBuilder<CourseMateReadOnlyDbContext>()
            .UseInMemoryDatabase(_databaseName, _databaseRoot)
            .ReplaceService<IModelCustomizer, InMemoryTestModelCustomizer>()
            .Options;

        return new CourseMateReadOnlyDbContext(options);
    }

    private static IHttpContextAccessor BuildHttpContextAccessor(Guid? userId, IReadOnlyCollection<string> roles)
    {
        List<Claim> claims = [];

        if (userId.HasValue)
        {
            claims.Add(new Claim(ClaimTypes.NameIdentifier, userId.Value.ToString()));
        }

        foreach (string role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        ClaimsIdentity identity = claims.Count > 0
            ? new ClaimsIdentity(claims, "TestAuth")
            : new ClaimsIdentity();
        DefaultHttpContext httpContext = new()
        {
            User = new ClaimsPrincipal(identity)
        };

        return new HttpContextAccessor
        {
            HttpContext = httpContext
        };
    }

    public UserManager<User> GetUserManager()
    {
        CourseMateDbContext dbContext = CreateWriteDbContext();
        UserStore<User, IdentityRole<Guid>, CourseMateDbContext, Guid> userStore = new(dbContext);
        UpperInvariantLookupNormalizer normalizer = new();
        NullLogger<UserManager<User>> logger = NullLogger<UserManager<User>>.Instance;
        IOptions<IdentityOptions> identityOptions = Options.Create(new IdentityOptions
        {
            Lockout = { AllowedForNewUsers = true },
            User = { RequireUniqueEmail = true }
        });
        UserValidator<User>[] userValidators = new[] { new UserValidator<User>() };
        PasswordValidator<User>[] passwordValidators = new[] { new PasswordValidator<User>() };
        IdentityErrorDescriber errorDescriber = new();
        UserManager<User> userManager = new(userStore, identityOptions, new PasswordHasher<User>(), userValidators, passwordValidators, normalizer, errorDescriber, null, logger);
        userManager.RegisterTokenProvider(TokenOptions.DefaultProvider, new EmailTokenProvider<User>());
        userManager.RegisterTokenProvider(TokenOptions.DefaultEmailProvider, new EmailTokenProvider<User>());
        userManager.RegisterTokenProvider(TokenOptions.DefaultPhoneProvider, new PhoneNumberTokenProvider<User>());
        return userManager;
    }

    public IUserStore<User> GetUserStore()
    {
        CourseMateDbContext dbContext = CreateWriteDbContext();
        return new UserStore<User, IdentityRole<Guid>, CourseMateDbContext, Guid>(dbContext);
    }

    public RoleManager<IdentityRole<Guid>> GetRoleManager()
    {
        CourseMateDbContext dbContext = CreateWriteDbContext();
        RoleStore<IdentityRole<Guid>, CourseMateDbContext, Guid> roleStore = new(dbContext);
        UpperInvariantLookupNormalizer normalizer = new();
        NullLogger<RoleManager<IdentityRole<Guid>>> logger = NullLogger<RoleManager<IdentityRole<Guid>>>.Instance;
        RoleManager<IdentityRole<Guid>> roleManager = new(roleStore, null, normalizer, null, logger);
        return roleManager;
    }

    public SignInManager<User> GetSignInManager()
    {
        UserManager<User> userManager = GetUserManager();
        IOptions<IdentityOptions> identityOptions = Options.Create(new IdentityOptions());
        UserClaimsPrincipalFactory<User> claimsPrincipalFactory = new(userManager, identityOptions);
        SignInManager<User> signInManager = new(userManager, HttpContextAccessor, claimsPrincipalFactory, identityOptions, null, null, null);
        return signInManager;
    }

    public IConfiguration GetConfiguration()
    {
        IConfigurationRoot config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                { "Jwt:Key", "ThisIsAVeryLongSecretKeyThatIsAtLeast32CharactersLongForHS256" },
                { "Jwt:ExpiryMinutes", "60" },
                { "Jwt:Issuer", "CourseMate" },
                { "Jwt:Audience", "CourseMateApp" },
                { "FrontendUrl", "http://localhost:3000" }
            })
            .Build();
        return config;
    }

    public void EnsureRolesCreated()
    {
        RoleManager<IdentityRole<Guid>> roleManager = GetRoleManager();
        CourseMateDbContext dbContext = CreateWriteDbContext();

        string[] roles = new[] { "Student", "Instructor", "Admin" };
        foreach (string roleName in roles)
        {
            if (!dbContext.Roles.Any(r => r.Name == roleName))
            {
                dbContext.Roles.Add(new IdentityRole<Guid> { Id = Guid.NewGuid(), Name = roleName, NormalizedName = roleName.ToUpper() });
            }
        }

        dbContext.SaveChanges();
    }

    private sealed class InMemoryTestModelCustomizer : ModelCustomizer
    {
        public InMemoryTestModelCustomizer(ModelCustomizerDependencies dependencies) : base(dependencies)
        {
        }

        public override void Customize(ModelBuilder modelBuilder, DbContext context)
        {
            base.Customize(modelBuilder, context);
            modelBuilder.Ignore<FileEntryEmbedding>();
            modelBuilder.Ignore<CourseEmbedding>();
        }
    }
}