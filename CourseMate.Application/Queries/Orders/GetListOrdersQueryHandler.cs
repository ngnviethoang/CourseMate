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

public sealed class GetListOrdersQueryHandler : AbstractQueryHandler<GetListOrdersQuery, PagedDto<OrderDto>>
{
    public GetListOrdersQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<PagedDto<OrderDto>> Handle(GetListOrdersQuery request, CancellationToken ct)
    {
        bool isFilterGuid = Guid.TryParse(request.Filter, out Guid filterId);

        IQueryable<OrderDto> query =
            from order in DbContext.Orders
            join student in DbContext.Users on order.StudentId equals student.Id
            select new OrderDto
            {
                Id = order.Id,
                Title = order.Description,
                StudentId = order.StudentId,
                StudentName = student.UserName,
                StudentEmail = student.Email,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                CreationTime = order.CreationTime,
                LastModificationTime = order.LastModificationTime,
                ItemsCount = DbContext.OrderItems.Count(oi => oi.OrderId == order.Id)
            };

        query = query
            .WhereIf(IsInRole(Roles.Student), x => x.StudentId == CurrentUserId)
            .WhereIf(IsInRole(Roles.Instructor), x => DbContext.OrderItems
                .Any(oi => oi.OrderId == x.Id && DbContext.Courses.Any(c => c.Id == oi.CourseId && c.InstructorId == CurrentUserId)))
            .WhereIf(isFilterGuid, x => x.Id == filterId)
            .WhereIf(!isFilterGuid && !string.IsNullOrWhiteSpace(request.Filter), x =>
                EF.Functions.ILike(x.Title, $"%{request.Filter}%") ||
                (x.StudentName != null && EF.Functions.ILike(x.StudentName, $"%{request.Filter}%")) ||
                (x.StudentEmail != null && EF.Functions.ILike(x.StudentEmail, $"%{request.Filter}%")));

        query = request.Sorting switch
        {
            "title" => query.OrderBy(x => x.Title),
            "title_desc" => query.OrderByDescending(x => x.Title),
            "creationTime" => query.OrderBy(x => x.CreationTime),
            "creationTime_desc" => query.OrderByDescending(x => x.CreationTime),
            "lastModificationTime" => query.OrderBy(x => x.LastModificationTime),
            "lastModificationTime_desc" => query.OrderByDescending(x => x.LastModificationTime),
            _ => query.OrderByDescending(x => x.CreationTime)
        };

        int totalCount = await query.CountAsync(ct);

        List<OrderDto> orders = await query
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