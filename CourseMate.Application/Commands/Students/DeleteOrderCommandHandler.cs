using CourseMate.Contracts.DTOs.Students;
using CourseMate.Infrastructure;
using Microsoft.AspNetCore.Http;

e CourseMate.Application.Commands.Students;

internal sealed class DeleteOrderCommandHandler : CommandHandler<DeleteOrderCommand>
{
    public DeleteOrderCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task Handle(DeleteOrderCommand request, CancellationToken cancellationToken)
    {
        Guid studentId = GetCurrentUserId();

        Order? order = await DbContext.Orders.FirstOrDefaultAsync(o => o.Id == request.Id && o.StudentId == studentId, cancellationToken);
        if (order == null)
        {
            throw new EntityNotFoundException(ExceptionMessages.EntityNotFound);
        }

        DbContext.Orders.Remove(order);
        await DbContext.SaveChangesAsync(cancellationToken);
    }
}