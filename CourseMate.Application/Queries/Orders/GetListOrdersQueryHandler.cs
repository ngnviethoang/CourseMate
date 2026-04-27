using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Orders;

public class GetListOrdersQuery : GetListQuery<OrderDto>
{
}

internal sealed class GetListOrdersQueryHandler : AbstractQueryHandler<GetListOrdersQuery, PagedDto<OrderDto>>
{
    public GetListOrdersQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<OrderDto>> Handle(GetListOrdersQuery request, CancellationToken ct)
    {
        Guid studentId = CurrentUserId;

        IQueryable<OrderDto> query = DbContext.Orders
            .Where(o => o.StudentId == studentId)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                StudentId = o.StudentId,
                TotalAmount = o.TotalAmount,
                Status = o.Status
            });

        int totalCount = await query.CountAsync(ct);

        List<OrderDto> orders = await query
            .OrderBy(o => o.Id)
            .Skip((request.PageIndex - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(ct);

        return new PagedDto<OrderDto>
        {
            Items = orders,
            TotalCount = totalCount,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize
        };
    }
}