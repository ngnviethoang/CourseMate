using System.Linq.Expressions;
using System.Security.Claims;
using CourseMate.Core.Entities;
using CourseMate.Core.Entities.Abstracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata;

namespace CourseMate.Core;

public sealed class CourseMateDbContext : IdentityDbContext<IdentityUser<Guid>, IdentityRole<Guid>, Guid>
{
    private const string SoftDeletionFilter = "SoftDeletionFilter";
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CourseMateDbContext(DbContextOptions<CourseMateDbContext> options, IHttpContextAccessor httpContextAccessor)
        : base(options)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public DbSet<Category> Categories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.HasPostgresExtension("citext");
        modelBuilder.ApplyConfigurationsFromAssembly(AssemblyReference.Assembly);
        foreach (IMutableEntityType entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(ISoftDelete).IsAssignableFrom(entityType.ClrType))
            {
                ParameterExpression parameter = Expression.Parameter(entityType.ClrType, "i");
                MemberExpression isDeletedProperty = Expression.Property(parameter, nameof(ISoftDelete.IsDeleted));
                UnaryExpression notIsDeleted = Expression.Not(isDeletedProperty);
                LambdaExpression lambda = Expression.Lambda(notIsDeleted, parameter);
                modelBuilder.Entity(entityType.ClrType).HasQueryFilter(SoftDeletionFilter, lambda);
            }
        }
    }

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        ApplyAuditAndSoftDelete();
        return base.SaveChanges(acceptAllChangesOnSuccess);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        ApplyAuditAndSoftDelete();
        return base.SaveChangesAsync(cancellationToken);
    }

    public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
    {
        ApplyAuditAndSoftDelete();
        return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
    }

    private void ApplyAuditAndSoftDelete()
    {
        DateTimeOffset now = DateTimeOffset.UtcNow;
        Guid? userId = GetUserId();

        foreach (EntityEntry entry in ChangeTracker.Entries())
        {
            if (entry.Entity is IAuditable auditable)
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        auditable.CreationTime = now;
                        auditable.UserId = userId;
                        break;
                    case EntityState.Modified:
                        auditable.LastModificationTime = now;
                        auditable.UserId = userId;
                        break;
                }
            }

            if (entry is { Entity: ISoftDelete softDelete, State: EntityState.Deleted })
            {
                entry.State = EntityState.Modified;
                softDelete.IsDeleted = true;
            }
        }
    }

    private Guid? GetUserId()
    {
        string? userId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(userId, out Guid id) ? id : null;
    }
}