using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Shared;
using CourseMate.Contracts;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Instructors;

public class UpdateCourseCommand : IRequest<int>
{
    public Guid Id { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string ImageUrl { get; set; } = string.Empty;

    public bool IsPublished { get; set; }

    public Guid CategoryId { get; set; }

    public Guid InstructorId { get; set; }
}

internal sealed class UpdateCourseCommandHandler : AbstractCommandHandler<UpdateCourseCommand, int>
{
    public UpdateCourseCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(UpdateCourseCommand request, CancellationToken cancellationToken)
    {
        Guid instructorId = GetCurrentUserId();
        Course? course = await DbContext.Courses.FirstOrDefaultAsync(x => x.Id == request.Id && x.InstructorId == instructorId, cancellationToken);
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