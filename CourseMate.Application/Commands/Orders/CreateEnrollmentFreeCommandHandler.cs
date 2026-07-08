using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Orders;

public class CreateEnrollmentFreeCommand : IRequest<ResultIdDto>
{
    public Guid CourseId { get; set; }
}

public sealed class CreateEnrollmentFreeCommandHandler : AbstractCommandHandler<CreateEnrollmentFreeCommand, ResultIdDto>
{
    public CreateEnrollmentFreeCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(CreateEnrollmentFreeCommand request, CancellationToken ct)
    {
        Guid studentId = CurrentUserId;
        if (!await DbContext.Courses.AnyAsync(course => course.Id == request.CourseId && course.IsPublished && course.Price == 0, ct))
        {
            throw new EntityNotFoundException(nameof(Course), request.CourseId);
        }

        Enrollment? enrollment = await DbContext.Enrollments.FirstOrDefaultAsync(enrollment => enrollment.StudentId == studentId && enrollment.CourseId == request.CourseId, ct);
        if (enrollment != null)
        {
            return new ResultIdDto { Id = enrollment.Id };
        }

        enrollment = new Enrollment(Guid.NewGuid(), studentId, request.CourseId);
        await DbContext.Enrollments.AddAsync(enrollment, ct);
        return new ResultIdDto { Id = enrollment.Id };
    }
}