using CourseMate.Contracts.DTOs.Students;
using CourseMate.Infrastructure;
using Microsoft.AspNetCore.Http;

e CourseMate.Application.Commands.Students;

internal sealed class UpdateOrderCommandHandler : CommandHandler<UpdateOrderCommand>
{
    public UpdateOrderCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task Handle(UpdateOrderCommand request, CancellationToken cancellationToken)
    {
        Guid studentId = GetCurrentUserId();

        Order? order = await DbContext.Orders.FirstOrDefaultAsync(o => o.Id == request.Id && o.StudentId == studentId, cancellationToken);
        if (order == null)
        {
            throw new EntityNotFoundException(ExceptionMessages.EntityNotFound);
        }

        order.Status = request.Status;
        await DbContext.SaveChangesAsync(cancellationToken);
    }
}