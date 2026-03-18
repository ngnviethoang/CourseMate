using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using MediatR;

namespace CourseMate.Application.Commands.Admins;

internal sealed class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, ResultIdDto>
{
    private readonly CourseMateDbContext _dbContext;

    public CreateCategoryCommandHandler(CourseMateDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ResultIdDto> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        Category category = new(Guid.NewGuid(), request.Name, request.Description, request.IsActive);

        await _dbContext.AddAsync(category, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new ResultIdDto { Id = category.Id };
    }
}