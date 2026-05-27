using CourseMate.Application.Shared;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Orders;

public class UpdateOrderCommand : IRequest<Unit>
{
    public Guid Id { get; init; }

    public OrderStatus Status { get; init; }
}

public sealed class UpdateOrderCommandHandler : AbstractCommandHandler<UpdateOrderCommand, Unit>
{
    public UpdateOrderCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<Unit> Handle(UpdateOrderCommand request, CancellationToken ct)
    {
        Order? order = await DbContext.Orders.FirstOrDefaultAsync(o => o.Id == request.Id && o.StudentId == CurrentUserId, ct);
        if (order == null)
        {
            throw new EntityNotFoundException(nameof(Order), request.Id);
        }

        order.Status = request.Status;
        return Unit.Value;
    }
}