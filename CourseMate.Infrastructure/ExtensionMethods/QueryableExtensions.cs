using System.Linq.Expressions;
using CourseMate.Contracts.Exceptions;
using CourseMate.Infrastructure.Entities.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Infrastructure.ExtensionMethods;

public static class QueryableExtensions
{
    extension<T>(IQueryable<T> source)
    {
        public IQueryable<T> Paged(int pageIndex, int pageSize)
        {
            return source.Skip((pageIndex - 1) * pageSize).Take(pageSize);
        }

        public IQueryable<T> WhereIf(bool condition, Expression<Func<T, bool>> predicate)
        {
            return condition ? source.Where(predicate) : source;
        }
    }

    extension<T>(DbSet<T> source) where T : Entity
    {
        public async Task EnsureExistsAsync(Guid id, CancellationToken cancellationToken)
        {
            if (!await source.AnyAsync(i => i.Id == id, cancellationToken))
            {
                throw new EntityNotFoundException(nameof(T), id);
            }
        }

        public async Task EnsureExistsAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken)
        {
            if (!await source.AnyAsync(predicate, cancellationToken))
            {
                throw new EntityNotFoundException(nameof(T), Guid.Empty);
            }
        }

        public async Task RemoveByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            T? entity = await source.FirstOrDefaultAsync(i => i.Id == id, cancellationToken);
            if (entity != null)
            {
                source.Remove(entity);
            }
        }
    }
}