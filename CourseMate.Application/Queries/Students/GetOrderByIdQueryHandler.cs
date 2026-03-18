using System.Security.Claims;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Students;
using CourseMate.Contracts.Exceptions;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Students;

internal sealed class GetOrderByIdQueryHandler : IRequestHandler<GetOrderByIdQuery, OrderDto?>
{
    private readonly CourseMateReadOnlyDbContext _dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetOrderByIdQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
    {
        _dbContext = dbContext;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<OrderDto?> Handle(GetOrderByIdQuery request, CancellationToken cancellationToken)
    {
        string? userIdString = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid studentId = Guid.TryParse(userIdString, out Guid parsedId) ? parsedId : Guid.Empty;

        Order? order = await _dbContext.Orders
            .FirstOrDefaultAsync(o => o.Id == request.Id && o.StudentId == studentId, cancellationToken);

        if (order == null)
        {
            throw new EntityNotFoundException(ExceptionMessages.EntityNotFound);
        }

        List<OrderItemDto> items = await (from item in _dbContext.OrderItems
            join course in _dbContext.Courses on item.CourseId equals course.Id
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