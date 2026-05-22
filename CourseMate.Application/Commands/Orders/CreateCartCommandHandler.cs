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

    public override async Task<ResultIdDto> Handle(CreateCartCommand request, CancellationToken ct)
    {
        Guid studentId = IsInRole(Roles.Admin) ? request.StudentId : CurrentUserId;

        if (!await DbContext.Users.AnyAsync(u => u.Id == studentId, ct))
        {
            throw new EntityNotFoundException(nameof(IdentityUser), studentId);
        }

        Cart? cart = await DbContext.Carts.FirstOrDefaultAsync(c => c.StudentId == studentId, ct);
        if (cart == null)
        {
            cart = new Cart(Guid.NewGuid(), studentId);
            await DbContext.Carts.AddAsync(cart, ct);
        }

        bool isExistItem = await DbContext.CartItems.AnyAsync(ci => ci.CartId == cart.Id && ci.CourseId == request.CourseId, ct);
        if (isExistItem)
        {
            throw new BusinessException(ErrorCode.CourseAlreadyInCart, "Course already exists in cart.");
        }

        bool isExistEnrollment = await DbContext.Enrollments.AnyAsync(ci => ci.StudentId == request.StudentId && ci.CourseId == request.CourseId, ct);
        if (isExistEnrollment)
        {
            throw new BusinessException(ErrorCode.CourseAlreadyEnrolled, "Student is already enrolled in this course.");
        }

        CartItem cartItem = new(Guid.NewGuid(), cart.Id, request.CourseId);
        await DbContext.CartItems.AddAsync(cartItem, ct);

        return new ResultIdDto { Id = cartItem.Id };
    }
}