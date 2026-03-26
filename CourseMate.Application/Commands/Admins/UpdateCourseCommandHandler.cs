using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Contracts.Exceptions;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Admins;

internal sealed class UpdateCourseAbstractCommandHandler : AbstractCommandHandler<UpdateCourseCommand, int>
{
    public UpdateCourseAbstractCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(UpdateCourseCommand request, CancellationToken cancellationToken)
    {
        Course? course = await DbContext.Courses
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (course == null)
        {
            throw new EntityNotFoundException(nameof(Course), request.Id);
        }

        course.Title = request.Title;
        course.Description = request.Description;
        course.Price = request.Price;
        course.ImageUrl = request.ImageUrl;
        course.IsPublished = request.IsPublished;
        course.CategoryId = request.CategoryId;
        course.InstructorId = request.InstructorId;

        DbContext.Update(course);
        return Codes.Success;
    }
}