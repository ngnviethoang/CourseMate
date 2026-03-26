using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Students;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Students;

internal sealed class DeleteOrderCommandHandler : AbstractCommandHandler<DeleteOrderCommand, int>
{
    public DeleteOrderCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(DeleteOrderCommand request, CancellationToken cancellationToken)
    {
        Guid studentId = GetCurrentUserId();

        if (!await DbContext.Orders.AnyAsync(o => o.Id == request.Id && o.StudentId == studentId, cancellationToken))
        {
            return Codes.Success;
        }

        await DbContext.Orders.RemoveByIdAsync(request.Id, cancellationToken);
        return Codes.Success;
    }
}