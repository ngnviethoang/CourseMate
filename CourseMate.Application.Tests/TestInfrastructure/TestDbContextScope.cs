using System.Security.Claims;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;

namespace CourseMate.Application.Tests.TestInfrastructure;

public sealed class TestDbContextScope
{
    private readonly string _databaseName = Guid.NewGuid().ToString("N");
    private readonly InMemoryDatabaseRoot _databaseRoot = new();

    public TestDbContextScope(Guid? userId = null, params string[] roles)
    {
        HttpContextAccessor = BuildHttpContextAccessor(userId, roles);
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

    private sealed class InMemoryTestModelCustomizer : ModelCustomizer
    {
        public InMemoryTestModelCustomizer(ModelCustomizerDependencies dependencies) : base(dependencies)
        {
        }

        public override void Customize(ModelBuilder modelBuilder, DbContext context)
        {
            base.Customize(modelBuilder, context);
            modelBuilder.Ignore<FileEntryEmbedding>();
        }
    }
}