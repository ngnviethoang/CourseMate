using System.Linq.Expressions;
using CourseMate.Core.Entities;
using CourseMate.Core.Entities.Abstracts;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace CourseMate.Core;

public sealed class CourseMateReadOnlyDbContext : IdentityDbContext<IdentityUser<Guid>, IdentityRole<Guid>, Guid>
{
    private const string SoftDeletionFilter = "SoftDeletionFilter";

    public CourseMateReadOnlyDbContext(DbContextOptions<CourseMateReadOnlyDbContext> options) : base(options)
    {
    }

    public DbSet<Category> Categories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
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

    public override int SaveChanges()
    {
        throw new InvalidOperationException("This DbContext is read-only.");
    }

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        throw new InvalidOperationException("This DbContext is read-only.");
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        throw new InvalidOperationException("This DbContext is read-only.");
    }

    public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
    {
        throw new InvalidOperationException("This DbContext is read-only.");
    }
}