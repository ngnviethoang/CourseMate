using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using MediatR;

namespace CourseMate.Application.Commands.Admins;

internal sealed class CreateCourseCommandHandler : IRequestHandler<CreateCourseCommand, ResultIdDto>
{
    private readonly CourseMateDbContext _dbContext;

    public CreateCourseCommandHandler(CourseMateDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ResultIdDto> Handle(CreateCourseCommand request, CancellationToken cancellationToken)
    {
        Course course = new(
            Guid.NewGuid(),
            request.Title,
            request.Description,
            request.Price,
            request.ImageUrl,
            request.IsPublished,
            request.CategoryId,
            request.InstructorId
        );

        await _dbContext.AddAsync(course, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new ResultIdDto { Id = course.Id };
    }
}