using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Admins;

public class UpdateOrderCommand : IRequest<int>
{
    public Guid Id { get; set; }

    public OrderStatus Status { get; set; }
}

internal sealed class UpdateOrderCommandHandler : AbstractCommandHandler<UpdateOrderCommand, int>
{
    public UpdateOrderCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(UpdateOrderCommand request, CancellationToken cancellationToken)
    {
        Order? order = await DbContext.Orders.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (order == null)
        {
            throw new EntityNotFoundException(nameof(Order), request.Id);
        }

        OrderStatus oldStatus = order.Status;
        order.Status = request.Status;

        if (oldStatus != OrderStatus.Paid && request.Status == OrderStatus.Paid)
        {
            List<Guid> courseIds = await DbContext.OrderItems
                .Where(x => x.OrderId == order.Id)
                .Select(x => x.CourseId)
                .ToListAsync(cancellationToken);
            IEnumerable<Enrollment> enrollments = courseIds.Select(courseId => new Enrollment(Guid.NewGuid(), order.StudentId, courseId));
            await DbContext.Enrollments.AddRangeAsync(enrollments, cancellationToken);
        }

        return Codes.Success;
    }
}