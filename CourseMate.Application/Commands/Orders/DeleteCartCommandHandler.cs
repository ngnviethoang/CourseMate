using CourseMate.Application.Shared;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Orders;

public class DeleteCartCommand : IRequest<Unit>
{
    public Guid CartItemId { get; init; }
}

public sealed class DeleteCartCommandHandler : AbstractCommandHandler<DeleteCartCommand, Unit>
{
    public DeleteCartCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<Unit> Handle(DeleteCartCommand request, CancellationToken ct)
    {
        Guid studentId = CurrentUserId;

        Cart? cart = await DbContext.Carts.FirstOrDefaultAsync(c => c.StudentId == studentId, ct);
        if (cart == null)
        {
            return Unit.Value;
        }

        CartItem? cartItem = await DbContext.CartItems.FirstOrDefaultAsync(ci => ci.CartId == cart.Id && ci.Id == request.CartItemId, ct);
        if (cartItem == null)
        {
            return Unit.Value;
        }

        await DbContext.CartItems.RemoveByIdAsync(request.CartItemId, ct);
        return Unit.Value;
    }
}