using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Admins;

public class GetListOrdersQuery : GetListQuery<AdminOrderDto>
{
    public OrderStatus? Status { get; set; }
}

internal sealed class GetListOrdersQueryHandler : AbstractQueryHandler<GetListOrdersQuery, PagedDto<AdminOrderDto>>
{
    public GetListOrdersQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<AdminOrderDto>> Handle(GetListOrdersQuery request, CancellationToken cancellationToken)
    {
        IQueryable<AdminOrderDto> query =
            from order in DbContext.Orders
            join student in DbContext.Users on order.StudentId equals student.Id
            select new AdminOrderDto
            {
                Id = order.Id,
                StudentId = order.StudentId,
                StudentName = student.UserName ?? string.Empty,
                StudentEmail = student.Email ?? string.Empty,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                CreationTime = order.CreationTime,
                ItemsCount = DbContext.OrderItems.Count(i => i.OrderId == order.Id)
            };

        query = query.WhereIf(!string.IsNullOrWhiteSpace(request.Filter), i =>
            EF.Functions.ILike(i.StudentName, $"%{request.Filter}%") ||
            EF.Functions.ILike(i.StudentEmail ?? "", $"%{request.Filter}%"));

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

        return new PagedDto<AdminOrderDto>
        {
            Items = orders,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = total
        };
    }
}