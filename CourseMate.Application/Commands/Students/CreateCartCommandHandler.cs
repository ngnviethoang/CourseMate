using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Students;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Students;

internal sealed class CreateCartCommandHandler : AbstractCommandHandler<CreateCartCommand, ResultIdDto>
{
    public CreateCartCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(CreateCartCommand request, CancellationToken cancellationToken)
    {
        Guid studentId = GetCurrentUserId();

        Cart? cart = await DbContext.Carts.FirstOrDefaultAsync(c => c.StudentId == studentId, cancellationToken);
        if (cart == null)
        {
            cart = new Cart(Guid.NewGuid(), studentId);
            await DbContext.Carts.AddAsync(cart, cancellationToken);
        }

        CartItem? existingItem = await DbContext.CartItems.FirstOrDefaultAsync(ci => ci.CartId == cart.Id && ci.CourseId == request.CourseId, cancellationToken);
        if (existingItem != null)
        {
            return new ResultIdDto { Id = existingItem.Id };
        }

        CartItem cartItem = new(Guid.NewGuid(), cart.Id, request.CourseId);
        await DbContext.CartItems.AddAsync(cartItem, cancellationToken);

        return new ResultIdDto { Id = cartItem.Id };
    }
}