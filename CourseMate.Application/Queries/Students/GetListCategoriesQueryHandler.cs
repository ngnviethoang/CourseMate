using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Students;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Students;

internal sealed class GetListCategoryQueryHandler : IRequestHandler<GetListCategoriesQuery, PagedDto<CategoryDto>>
{
    private readonly CourseMateReadOnlyDbContext _dbContext;

    public GetListCategoryQueryHandler(CourseMateReadOnlyDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedDto<CategoryDto>> Handle(GetListCategoriesQuery request, CancellationToken cancellationToken)
    {
        IQueryable<Category> query = _dbContext.Categories.AsQueryable();

        int total = await query.CountAsync(cancellationToken);

        List<CategoryDto> categories = await query
            .Skip((request.PageIndex - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(i => new CategoryDto
            {
                Id = i.Id,
                Name = i.Name,
                Description = i.Description,
                IsActive = i.IsActive,
                CreationTime = i.CreationTime,
                LastModificationTime = i.LastModificationTime
            })
            .ToListAsync(cancellationToken);

        return new PagedDto<CategoryDto>
        {
            PageSize = request.PageSize,
            PageIndex = request.PageIndex,
            TotalCount = total,
            Items = categories
        };
    }
}