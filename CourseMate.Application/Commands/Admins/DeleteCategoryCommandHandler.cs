using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Contracts.Exceptions;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Admins;

internal sealed class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand>
{
    private readonly CourseMateDbContext _dbContext;

    public DeleteCategoryCommandHandler(CourseMateDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        Category? category = await _dbContext.Categories
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (category == null)
        {
            throw new EntityNotFoundException(ExceptionMessages.EntityNotFound);
        }

        _dbContext.Remove(category);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}