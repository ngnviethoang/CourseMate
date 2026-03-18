using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Admins;

internal sealed class GetCategoryByIdQueryHandler : IRequestHandler<GetCategoryByIdQuery, CategoryDto?>
{
    private readonly CourseMateReadOnlyDbContext _dbContext;

    public GetCategoryByIdQueryHandler(CourseMateReadOnlyDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CategoryDto?> Handle(GetCategoryByIdQuery request, CancellationToken cancellationToken)
    {
        CategoryDto? category = await _dbContext.Categories
            .Where(x => x.Id == request.Id)
            .Select(x => new CategoryDto
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                IsActive = x.IsActive
            })
            .FirstOrDefaultAsync(cancellationToken);

        return category;
    }
}