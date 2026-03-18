using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Contracts.Exceptions;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Admins;

internal sealed class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand>
{
    private readonly CourseMateDbContext _dbContext;

    public UpdateCategoryCommandHandler(CourseMateDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        Category? category = await _dbContext.Categories.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (category == null)
        {
            throw new EntityNotFoundException(ExceptionMessages.EntityNotFound);
        }

        category.Name = request.Name;
        category.Description = request.Description;
        category.IsActive = request.IsActive;

        _dbContext.Update(category);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}