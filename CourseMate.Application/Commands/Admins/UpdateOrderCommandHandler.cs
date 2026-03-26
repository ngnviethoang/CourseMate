using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Contracts.Enums;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Admins;

internal sealed class UpdateOrderCommandHandler : AbstractCommandHandler<UpdateOrderCommand>
{
    public UpdateOrderCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task Handle(UpdateOrderCommand request, CancellationToken cancellationToken)
    {
        var order = await DbContext.Orders
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (order == null) return;

        var oldStatus = order.Status;
        order.Status = request.Status;

        // If order becomes Paid, enroll student in all courses in the order
        if (oldStatus != OrderStatus.Paid && request.Status == OrderStatus.Paid)
        {
            var courseIds = await DbContext.OrderItems
                .Where(x => x.OrderId == order.Id)
                .Select(x => x.CourseId)
                .ToListAsync(cancellationToken);

            foreach (var courseId in courseIds)
            {
                var isEnrolled = await DbContext.Enrollments
                    .AnyAsync(x => x.StudentId == order.StudentId && x.CourseId == courseId, cancellationToken);

                if (!isEnrolled)
                {
                    DbContext.Enrollments.Add(new Enrollment(Guid.NewGuid(), order.StudentId, courseId));
                }
            }
        }

        await DbContext.SaveChangesAsync(cancellationToken);
    }
}
