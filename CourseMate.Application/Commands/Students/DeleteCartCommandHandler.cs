using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Students;
using CourseMate.Contracts.Exceptions;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using CourseMate.Infrastructure.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Students;

internal sealed class DeleteCartCommandHandler : AbstractCommandHandler<DeleteCartCommand>
{
    public DeleteCartCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task Handle(DeleteCartCommand request, CancellationToken cancellationToken)
    {
        Guid studentId = GetCurrentUserId();

        Cart? cart = await DbContext.Carts.FirstOrDefaultAsync(c => c.StudentId == studentId, cancellationToken);
        if (cart == null)
        {
            return;
        }

        CartItem? cartItem = await DbContext.CartItems.FirstOrDefaultAsync(ci => ci.CartId == cart.Id && ci.Id == request.CartItemId, cancellationToken);
        if (cartItem == null)
        {
            return;
        }

        await DbContext.CartItems.RemoveByIdAsync(request.CartItemId, cancellationToken);
        await DbContext.SaveChangesAsync(cancellationToken);
    }
}