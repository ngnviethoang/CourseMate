using System.Linq.Expressions;
using CourseMate.Contracts.Exceptions;
using CourseMate.Infrastructure.Entities.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Infrastructure.ExtensionMethods;

public static class QueryableExtensions
{
    public static IQueryable<T> Paged<T>(this IQueryable<T> source, int pageIndex, int pageSize)
    {
        return source.Skip((pageIndex - 1) * pageSize).Take(pageSize);
    }

    public static async Task EnsureExistsAsync<T>(this DbSet<T> source, Guid id, CancellationToken cancellationToken) where T : Entity
    {
        if (!await source.AnyAsync(i => i.Id == id, cancellationToken))
        {
            throw new EntityNotFoundException(nameof(T), id);
        }
    }

    public static async Task EnsureExistsAsync<T>(this DbSet<T> source, Expression<Func<T, bool>> predicate, CancellationToken cancellationToken) where T : Entity
    {
        if (!await source.AnyAsync(predicate, cancellationToken))
        {
            throw new EntityNotFoundException(nameof(T), Guid.Empty);
        }
    }

    public static async Task RemoveByIdAsync<T>(this DbSet<T> source, Guid id, CancellationToken cancellationToken) where T : Entity
    {
        T? entity = await source.FirstOrDefaultAsync(i => i.Id == id, cancellationToken);
        if (entity != null)
        {
            source.Remove(entity);
        }
    }
}