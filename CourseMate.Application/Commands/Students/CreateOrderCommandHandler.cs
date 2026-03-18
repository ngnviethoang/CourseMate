using System.Security.Claims;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Students;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Students;

internal sealed class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, ResultIdDto>
{
    private readonly CourseMateDbContext _dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CreateOrderCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
    {
        _dbContext = dbContext;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<ResultIdDto> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        string? userIdString = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid studentId = Guid.TryParse(userIdString, out Guid parsedId) ? parsedId : Guid.Empty;

        Cart? cart = await _dbContext.Carts.FirstOrDefaultAsync(c => c.StudentId == studentId, cancellationToken);
        if (cart == null)
        {
            throw new EntityNotFoundException(ExceptionMessages.EntityNotFound);
        }

        List<CartItem> cartItems = await _dbContext.CartItems
            .Where(ci => ci.CartId == cart.Id)
            .ToListAsync(cancellationToken);

        if (cartItems.Count == 0)
        {
            throw new BusinessException(ExceptionMessages.EntityCreationFailed);
        }

        List<Guid> courseIds = cartItems.Select(ci => ci.CourseId).ToList();
        List<Course> courses = await _dbContext.Courses.Where(c => courseIds.Contains(c.Id)).ToListAsync(cancellationToken);

        Guid orderId = Guid.NewGuid();
        decimal totalAmount = courses.Sum(c => c.Price);

        Order order = new(orderId, studentId, totalAmount, OrderStatus.Pending);
        _dbContext.Orders.Add(order);

        foreach (Course course in courses)
        {
            OrderItem orderItem = new(Guid.NewGuid(), orderId, course.Id, course.Price);
            _dbContext.OrderItems.Add(orderItem);
        }

        _dbContext.CartItems.RemoveRange(cartItems);

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new ResultIdDto { Id = orderId };
    }
}