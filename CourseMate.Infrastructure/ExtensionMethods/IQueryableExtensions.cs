using CourseMate.Contracts.Exceptions;
using CourseMate.Infrastructure.Entities.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Infrastructure.ExtensionMethods;

public static class QueryableExtensions
{
    public static IQueryable<T> PagedAsync<T>(this IQueryable<T> source, int page, int pageSize)
    {
        return source.Skip((page - 1) * pageSize).Take(pageSize);
    }

    public static async Task EnsureExistsAsync<T>(this IQueryable<T> source, Guid id) where T : Entity
    {
        if (!await source.AnyAsync(i => i.Id == id))
        {
            throw new EntityNotFoundException();
        }
    }
}