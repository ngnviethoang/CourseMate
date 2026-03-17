using CourseMate.Contract.DTOs;
using CourseMate.Contract.DTOs.Admins;
using CourseMate.Core;
using CourseMate.Core.Entities;
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
        Category category = new(Guid.NewGuid(), request.Name, request.Description, false);

        await _dbContext.AddAsync(category, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new ResultIdDto(category.Id);
    }
}