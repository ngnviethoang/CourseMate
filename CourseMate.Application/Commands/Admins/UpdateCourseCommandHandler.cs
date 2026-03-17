using CourseMate.Contract.Constants;
using CourseMate.Contract.DTOs.Admins;
using CourseMate.Contract.Exceptions;
using CourseMate.Core;
using CourseMate.Core.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Admins;

internal sealed class UpdateCourseCommandHandler : IRequestHandler<UpdateCourseCommand>
{
    private readonly CourseMateDbContext _dbContext;

    public UpdateCourseCommandHandler(CourseMateDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Handle(UpdateCourseCommand request, CancellationToken cancellationToken)
    {
        Course? course = await _dbContext.Courses.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (course == null)
        {
            throw new EntityNotFoundException(ExceptionMessages.EntityNotFound);
        }

        course.Title = request.Title;
        course.Description = request.Description;
        course.Price = request.Price;
        course.ImageUrl = request.ImageUrl;
        course.IsPublished = request.IsPublished;
        course.CategoryId = request.CategoryId;
        course.InstructorId = request.InstructorId;

        _dbContext.Update(course);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}