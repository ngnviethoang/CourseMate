using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Students;

public class DeleteCartCommand : IRequest<int>
{
    public Guid CartItemId { get; init; }
}

internal sealed class DeleteCartCommandHandler : AbstractCommandHandler<DeleteCartCommand, int>
{
    public DeleteCartCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(DeleteCartCommand request, CancellationToken cancellationToken)
    {
        Guid studentId = GetCurrentUserId();

        Cart? cart = await DbContext.Carts.FirstOrDefaultAsync(c => c.StudentId == studentId, cancellationToken);
        if (cart == null)
        {
            return Codes.Success;
        }

        CartItem? cartItem = await DbContext.CartItems.FirstOrDefaultAsync(ci => ci.CartId == cart.Id && ci.Id == request.CartItemId, cancellationToken);
        if (cartItem == null)
        {
            return Codes.Success;
        }

        await DbContext.CartItems.RemoveByIdAsync(request.CartItemId, cancellationToken);
        return Codes.Success;
    }
}