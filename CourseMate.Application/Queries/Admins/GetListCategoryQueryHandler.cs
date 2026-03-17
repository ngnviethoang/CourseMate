using CourseMate.Contract.DTOs;
using CourseMate.Contract.DTOs.Admins;
using CourseMate.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Admins;

internal sealed class GetListCategoryQueryHandler : IRequestHandler<GetListCategoriesQuery, PagedDto<CategoryDto>>
{
    private readonly CourseMateReadOnlyDbContext _dbContext;

    public GetListCategoryQueryHandler(CourseMateReadOnlyDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedDto<CategoryDto>> Handle(GetListCategoriesQuery request, CancellationToken cancellationToken)
    {
        List<CategoryDto> categories = await _dbContext.Categories
            .Select(i => new CategoryDto
            {
                Id = i.Id,
                Name = i.Name,
                Description = i.Description,
                IsActive = i.IsActive
            })
            .ToListAsync(cancellationToken);

        return new PagedDto<CategoryDto>
        {
            PageSize = request.PageSize,
            PageIndex = request.PageIndex,
            Items = categories
        };
    }
}