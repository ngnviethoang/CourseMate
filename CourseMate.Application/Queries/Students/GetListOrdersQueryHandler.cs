using System.Security.Claims;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Students;
using CourseMate.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Students;

internal sealed class GetListOrdersQueryHandler : IRequestHandler<GetListOrdersQuery, PagedDto<OrderDto>>
{
    private readonly CourseMateReadOnlyDbContext _dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetListOrdersQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
    {
        _dbContext = dbContext;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<PagedDto<OrderDto>> Handle(GetListOrdersQuery request, CancellationToken cancellationToken)
    {
        string? userIdString = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid studentId = Guid.TryParse(userIdString, out Guid parsedId) ? parsedId : Guid.Empty;

        IQueryable<OrderDto> query = _dbContext.Orders
            .Where(o => o.StudentId == studentId)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                StudentId = o.StudentId,
                TotalAmount = o.TotalAmount,
                Status = o.Status
            });

        int totalCount = await query.CountAsync(cancellationToken);

        List<OrderDto> orders = await query
            .OrderBy(o => o.Id) // Basic sorting
            .Skip((request.PageIndex - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedDto<OrderDto>
        {
            Items = orders,
            TotalCount = totalCount,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize
        };
    }
}