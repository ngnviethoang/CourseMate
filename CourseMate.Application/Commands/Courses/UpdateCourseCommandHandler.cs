using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Shared;
using CourseMate.Contracts;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Courses;

public class UpdateCourseCommand : IRequest<Unit>
{
    public Guid Id { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    [Required]
    public string Title { get; set; } = string.Empty;

    [MaxLength(CourseMateConsts.DescriptionMaxLength)]
    [Required]
    public string Description { get; set; } = string.Empty;

    [Range(0, int.MaxValue)]
    public int Price { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string ImageUrl { get; set; } = string.Empty;

    public bool IsPublished { get; set; }

    public Guid CategoryId { get; set; }
}

public sealed class UpdateCourseCommandHandler : AbstractCommandHandler<UpdateCourseCommand, Unit>
{
    public UpdateCourseCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<Unit> Handle(UpdateCourseCommand request, CancellationToken ct)
    {
        Course? course = await DbContext.Courses
            .WhereIf(IsInRole(Roles.Instructor), course => course.InstructorId == CurrentUserId)
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);
        if (course == null)
        {
            throw new EntityNotFoundException(nameof(Course), request.Id);
        }

        await DbContext.Categories.EnsureExistsAsync(request.CategoryId, ct);

        course.Title = request.Title;
        course.Description = request.Description;
        course.Price = request.Price;
        course.ImageUrl = request.ImageUrl;
        course.IsPublished = request.IsPublished;
        course.CategoryId = request.CategoryId;

        DbContext.Update(course);
        return Unit.Value;
    }
}