using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Shared;
using CourseMate.Contracts;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Courses;

public class CreateCourseCommand : IRequest<ResultIdDto>
{
    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(CourseMateConsts.DescriptionMaxLength)]
    public string Description { get; set; } = string.Empty;

    [Range(0, int.MaxValue)]
    public int Price { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string ImageUrl { get; set; } = string.Empty;

    public bool IsPublished { get; set; }

    public Guid CategoryId { get; set; }
}

public sealed class CreateCourseCommandHandler : AbstractCommandHandler<CreateCourseCommand, ResultIdDto>
{
    public CreateCourseCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(CreateCourseCommand request, CancellationToken ct)
    {
        await DbContext.Categories.EnsureExistsAsync(request.CategoryId, ct);
        Guid userId = CurrentUserId;

        Course course = new(
            Guid.NewGuid(),
            request.Title,
            request.Description,
            request.Price,
            request.ImageUrl,
            request.IsPublished,
            request.CategoryId,
            userId
        );

        await DbContext.AddAsync(course, ct);
        return new ResultIdDto { Id = course.Id };
    }
}