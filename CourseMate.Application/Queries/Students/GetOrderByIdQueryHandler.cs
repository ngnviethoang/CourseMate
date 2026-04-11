using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Students;

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

    public override async Task<OrderDto?> Handle(GetOrderByIdQuery request, CancellationToken cancellationToken)
    {
        Guid studentId = GetCurrentUserId();

        Order? order = await DbContext.Orders
            .FirstOrDefaultAsync(o => o.Id == request.Id && o.StudentId == studentId, cancellationToken);

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
            }).ToListAsync(cancellationToken);

        return new OrderDto
        {
            Id = order.Id,
            StudentId = order.StudentId,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            Items = items
        };
    }
}