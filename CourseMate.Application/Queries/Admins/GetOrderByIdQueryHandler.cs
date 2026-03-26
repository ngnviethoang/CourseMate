using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Admins;

internal sealed class GetOrderByIdQueryHandler : AbstractQueryHandler<GetOrderByIdQuery, AdminOrderDto?>
{
    public GetOrderByIdQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<AdminOrderDto?> Handle(GetOrderByIdQuery request, CancellationToken cancellationToken)
    {
        var order = await (from o in DbContext.Orders
            join student in DbContext.Users on o.StudentId equals student.Id
            where o.Id == request.Id
            select new AdminOrderDto
            {
                Id = o.Id,
                StudentId = o.StudentId,
                StudentName = student.UserName,
                StudentEmail = student.Email,
                TotalAmount = o.TotalAmount,
                Status = o.Status,
                CreationTime = o.CreationTime
            }).FirstOrDefaultAsync(cancellationToken);

        if (order == null) return null;

        order.Items = await (from item in DbContext.OrderItems
            join course in DbContext.Courses on item.CourseId equals course.Id
            where item.OrderId == order.Id
            select new AdminOrderItemDto
            {
                Id = item.Id,
                OrderId = item.OrderId,
                CourseId = item.CourseId,
                CourseTitle = course.Title,
                Price = item.Price
            }).ToListAsync(cancellationToken);

        order.ItemsCount = order.Items.Count;

        return order;
    }
}
