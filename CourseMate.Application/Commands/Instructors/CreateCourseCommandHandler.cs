using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Instructors;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Instructors;

internal sealed class CreateCourseCommandHandler : AbstractCommandHandler<CreateCourseCommand, ResultIdDto>
{
    public CreateCourseCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(CreateCourseCommand request, CancellationToken cancellationToken)
    {
        Guid instructorId = GetCurrentUserId();

        Course course = new(
            Guid.NewGuid(),
            request.Title,
            request.Description,
            request.Price,
            request.ImageUrl,
            request.IsPublished,
            request.CategoryId,
            instructorId
        );

        await DbContext.AddAsync(course, cancellationToken);
        return new ResultIdDto { Id = course.Id };
    }
}