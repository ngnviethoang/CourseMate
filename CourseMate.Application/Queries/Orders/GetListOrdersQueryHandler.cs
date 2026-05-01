using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
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
        IQueryable<OrderDto> query = DbContext.Orders
            .WhereIf(IsInRole(Roles.Student), o => o.StudentId == CurrentUserId)
            .WhereIf(IsInRole(Roles.Instructor), o => DbContext.OrderItems.Any(oi => oi.OrderId == o.Id && DbContext.Courses.Any(c => c.Id == oi.CourseId && c.InstructorId == CurrentUserId)))
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
            .Paged(request.PageIndex, request.PageSize)
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