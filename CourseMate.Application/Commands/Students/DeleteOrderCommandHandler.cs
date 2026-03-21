using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Students;
using CourseMate.Contracts.Exceptions;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using CourseMate.Infrastructure.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Students;

internal sealed class DeleteOrderCommandHandler : AbstractCommandHandler<DeleteOrderCommand>
{
    public DeleteOrderCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task Handle(DeleteOrderCommand request, CancellationToken cancellationToken)
    {
        Guid studentId = GetCurrentUserId();

        if (!await DbContext.Orders.AnyAsync(o => o.Id == request.Id && o.StudentId == studentId, cancellationToken))
        {
            return;
        }

        await DbContext.Orders.RemoveByIdAsync(request.Id, cancellationToken);
        await DbContext.SaveChangesAsync(cancellationToken);
    }
}