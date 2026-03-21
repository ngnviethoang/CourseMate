using CourseMate.Contracts.DTOs.Students;
using CourseMate.Infrastructure;
using Microsoft.AspNetCore.Http;

e CourseMate.Application.Commands.Students;

internal sealed class DeleteCartCommandHandler : CommandHandler<DeleteCartCommand>
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
            throw new EntityNotFoundException(ExceptionMessages.EntityNotFound);
        }

        CartItem? cartItem = await DbContext.CartItems.FirstOrDefaultAsync(ci => ci.CartId == cart.Id && ci.Id == request.CartItemId, cancellationToken);
        if (cartItem == null)
        {
            throw new EntityNotFoundException(ExceptionMessages.EntityNotFound);
        }

        DbContext.CartItems.Remove(cartItem);
        await DbContext.SaveChangesAsync(cancellationToken);
    }
}