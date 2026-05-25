using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Orders;

public class GetOrderByIdQuery : IRequest<OrderDto?>
{
    public Guid Id { get; init; }
}

internal sealed class GetOrderByIdQueryHandler : AbstractQueryHandler<GetOrderByIdQuery, OrderDto?>
{
    public GetOrderByIdQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<OrderDto?> Handle(GetOrderByIdQuery request, CancellationToken ct)
    {
        Guid studentId = CurrentUserId;

        Order? order = await DbContext.Orders
            .FirstOrDefaultAsync(o => o.Id == request.Id && o.StudentId == studentId, ct);

        if (order == null)
        {
            throw new EntityNotFoundException(nameof(Order), request.Id);
        }

        List<OrderItemDto> items = await (from item in DbContext.OrderItems
            join course in DbContext.Courses on item.CourseId equals course.Id
            where item.OrderId == order.Id
            select new OrderItemDto
            {
                Id = item.Id,
                CourseId = course.Id,
                CourseTitle = course.Title,
                CourseImageUrl = course.ImageUrl,
                Price = item.Price
            }).ToListAsync(ct);

        var student = await DbContext.Users
            .Where(x => x.Id == order.StudentId)
            .Select(x => new { x.UserName, x.Email })
            .FirstOrDefaultAsync(ct);

        return new OrderDto
        {
            Id = order.Id,
            Title = order.Description,
            StudentId = order.StudentId,
            StudentName = student?.UserName,
            StudentEmail = student?.Email,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            CreationTime = order.CreationTime,
            LastModificationTime = order.LastModificationTime,
            Items = items
        };
    }
}