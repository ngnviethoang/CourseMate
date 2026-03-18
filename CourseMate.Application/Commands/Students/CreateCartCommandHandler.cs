using System.Security.Claims;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Students;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Students;

internal sealed class CreateCartCommandHandler : IRequestHandler<CreateCartCommand, ResultIdDto>
{
    private readonly CourseMateDbContext _dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CreateCartCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
    {
        _dbContext = dbContext;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<ResultIdDto> Handle(CreateCartCommand request, CancellationToken cancellationToken)
    {
        string? userIdString = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid studentId = Guid.TryParse(userIdString, out Guid parsedId) ? parsedId : Guid.Empty;

        Cart? cart = await _dbContext.Carts.FirstOrDefaultAsync(c => c.StudentId == studentId, cancellationToken);
        if (cart == null)
        {
            cart = new Cart(Guid.NewGuid(), studentId);
            _dbContext.Carts.Add(cart);
        }

        CartItem? existingItem = await _dbContext.CartItems.FirstOrDefaultAsync(ci => ci.CartId == cart.Id && ci.CourseId == request.CourseId, cancellationToken);
        if (existingItem != null)
        {
            return new ResultIdDto { Id = existingItem.Id };
        }

        CartItem cartItem = new(Guid.NewGuid(), cart.Id, request.CourseId);
        _dbContext.CartItems.Add(cartItem);

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new ResultIdDto { Id = cartItem.Id };
    }
}