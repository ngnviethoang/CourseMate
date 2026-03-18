using System.Security.Claims;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Students;
using CourseMate.Contracts.Exceptions;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Students;

internal sealed class DeleteCartCommandHandler : IRequestHandler<DeleteCartCommand>
{
    private readonly CourseMateDbContext _dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public DeleteCartCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
    {
        _dbContext = dbContext;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task Handle(DeleteCartCommand request, CancellationToken cancellationToken)
    {
        string? userIdString = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid studentId = Guid.TryParse(userIdString, out Guid parsedId) ? parsedId : Guid.Empty;

        Cart? cart = await _dbContext.Carts.FirstOrDefaultAsync(c => c.StudentId == studentId, cancellationToken);
        if (cart == null)
        {
            throw new EntityNotFoundException(ExceptionMessages.EntityNotFound);
        }

        CartItem? cartItem = await _dbContext.CartItems.FirstOrDefaultAsync(ci => ci.CartId == cart.Id && ci.Id == request.CartItemId, cancellationToken);
        if (cartItem == null)
        {
            throw new EntityNotFoundException(ExceptionMessages.EntityNotFound);
        }

        _dbContext.CartItems.Remove(cartItem);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}