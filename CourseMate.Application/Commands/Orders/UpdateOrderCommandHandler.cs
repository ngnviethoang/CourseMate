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
        bool isAdmin = IsInRole(Roles.Admin);

        // Admin can update any order; students can only update their own orders.
        Order? order = isAdmin
            ? await DbContext.Orders.FirstOrDefaultAsync(o => o.Id == request.Id, ct)
            : await DbContext.Orders.FirstOrDefaultAsync(o => o.Id == request.Id && o.StudentId == CurrentUserId, ct);

        if (order == null)
        {
            throw new EntityNotFoundException(nameof(Order), request.Id);
        }

        OrderStatus previousStatus = order.Status;
        order.Status = request.Status;

        // When an admin marks the order as Completed, automatically enroll the student in the purchased courses.
        if (request.Status == OrderStatus.Completed && previousStatus != OrderStatus.Completed)
        {
            List<Guid> courseIds = await DbContext.OrderItems
                .Where(i => i.OrderId == order.Id)
                .Select(i => i.CourseId)
                .Distinct()
                .ToListAsync(ct);

            // Retrieve existing enrollments to prevent duplicate records.
            List<Guid> existingEnrolledCourseIds = await DbContext.Enrollments
                .Where(e => e.StudentId == order.StudentId && courseIds.Contains(e.CourseId))
                .Select(e => e.CourseId)
                .ToListAsync(ct);

            List<Guid> newCourseIds = courseIds.Except(existingEnrolledCourseIds).ToList();

            foreach (Guid courseId in newCourseIds)
            {
                Enrollment enrollment = new(Guid.NewGuid(), order.StudentId, courseId);
                await DbContext.Enrollments.AddAsync(enrollment, ct);
            }
        }

        return Unit.Value;
    }
}