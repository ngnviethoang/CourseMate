using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Orders;

public class CreateCartCommand : IRequest<ResultIdDto>
{
    public Guid CourseId { get; init; }

    public Guid StudentId { get; init; }
}

internal sealed class CreateCartCommandHandler : AbstractCommandHandler<CreateCartCommand, ResultIdDto>
{
    public CreateCartCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(CreateCartCommand request, CancellationToken cancellationToken)
    {
        Guid studentId = IsInRole(Roles.Admin) ? request.StudentId : GetCurrentUserId();

        if (!await DbContext.Users.AnyAsync(u => u.Id == studentId, cancellationToken))
        {
            throw new EntityNotFoundException(nameof(IdentityUser), studentId);
        }

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