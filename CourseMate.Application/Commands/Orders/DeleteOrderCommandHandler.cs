using CourseMate.Application.Shared;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Orders;

public class DeleteOrderCommand : IRequest<Unit>
{
    public Guid Id { get; init; }
}

internal sealed class DeleteOrderCommandHandler : AbstractCommandHandler<DeleteOrderCommand, Unit>
{
    public DeleteOrderCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<Unit> Handle(DeleteOrderCommand request, CancellationToken ct)
    {
        Guid studentId = CurrentUserId;

        if (!await DbContext.Orders.AnyAsync(o => o.Id == request.Id && o.StudentId == studentId, ct))
        {
            return Unit.Value;
        }

        await DbContext.Orders.RemoveByIdAsync(request.Id, ct);
        return Unit.Value;
    }
}