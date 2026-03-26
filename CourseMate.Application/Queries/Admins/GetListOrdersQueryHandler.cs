using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Admins;

internal sealed class GetListOrdersQueryHandler : AbstractQueryHandler<GetListOrdersQuery, PagedDto<AdminOrderDto>>
{
    public GetListOrdersQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<AdminOrderDto>> Handle(GetListOrdersQuery request, CancellationToken cancellationToken)
    {
        var query = from order in DbContext.Orders
            join student in DbContext.Users on order.StudentId equals student.Id
            select new AdminOrderDto
            {
                Id = order.Id,
                StudentId = order.StudentId,
                StudentName = student.UserName,
                StudentEmail = student.Email,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                CreationTime = order.CreationTime
            };

        if (request.Status.HasValue)
        {
            query = query.Where(x => x.Status == request.Status.Value);
        }

        if (!string.IsNullOrEmpty(request.Filter))
        {
            query = query.Where(x => 
                (x.StudentName != null && x.StudentName.Contains(request.Filter)) || 
                (x.StudentEmail != null && x.StudentEmail.Contains(request.Filter)) ||
                x.Id.ToString().Contains(request.Filter));
        }

        query = request.Sorting switch
        {
            "totalAmount" => query.OrderBy(x => x.TotalAmount),
            "totalAmount_desc" => query.OrderByDescending(x => x.TotalAmount),
            _ => query.OrderByDescending(x => x.CreationTime)
        };

        int total = await query.CountAsync(cancellationToken);

        List<AdminOrderDto> orders = await query
            .Paged(request.PageIndex, request.PageSize)
            .ToListAsync(cancellationToken);

        // Fetch items count for each order
        foreach (var order in orders)
        {
            order.ItemsCount = await DbContext.OrderItems.CountAsync(x => x.OrderId == order.Id, cancellationToken);
        }

        return new PagedDto<AdminOrderDto>
        {
            Items = orders,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = total
        };
    }
}
