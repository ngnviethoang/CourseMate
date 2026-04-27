using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Orders;

public class DeleteOrderCommand : IRequest<int>
{
    public Guid Id { get; init; }
}

internal sealed class DeleteOrderCommandHandler : AbstractCommandHandler<DeleteOrderCommand, int>
{
    public DeleteOrderCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(DeleteOrderCommand request, CancellationToken ct)
    {
        Guid studentId = CurrentUserId;

        if (!await DbContext.Orders.AnyAsync(o => o.Id == request.Id && o.StudentId == studentId, ct))
        {
            return Codes.Success;
        }

        await DbContext.Orders.RemoveByIdAsync(request.Id, ct);
        return Codes.Success;
    }
}