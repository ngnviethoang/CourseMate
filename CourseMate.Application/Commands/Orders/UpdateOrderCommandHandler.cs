using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Orders;

public class UpdateOrderCommand : IRequest<int>
{
    public Guid Id { get; init; }

    public OrderStatus Status { get; init; }
}

internal sealed class UpdateOrderCommandHandler : AbstractCommandHandler<UpdateOrderCommand, int>
{
    public UpdateOrderCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(UpdateOrderCommand request, CancellationToken cancellationToken)
    {
        Guid studentId = GetCurrentUserId();

        Order? order = await DbContext.Orders.FirstOrDefaultAsync(o => o.Id == request.Id && o.StudentId == studentId, cancellationToken);
        if (order == null)
        {
            throw new EntityNotFoundException(nameof(Order), request.Id);
        }

        order.Status = request.Status;
        return Codes.Success;
    }
}