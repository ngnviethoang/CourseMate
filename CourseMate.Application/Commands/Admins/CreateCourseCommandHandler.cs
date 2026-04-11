using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Admins;

public class CreateCourseCommand : IRequest<ResultIdDto>
{
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    public bool IsPublished { get; set; }

    public Guid CategoryId { get; set; }
}

internal sealed class CreateCourseCommandHandler : AbstractCommandHandler<CreateCourseCommand, ResultIdDto>
{
    public CreateCourseCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(CreateCourseCommand request, CancellationToken cancellationToken)
    {
        Guid userId = GetCurrentUserId();

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

        await DbContext.AddAsync(course, cancellationToken);
        return new ResultIdDto { Id = course.Id };
    }
}