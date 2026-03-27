using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Admins;

internal sealed class CreateCategoryCommandHandler : AbstractCommandHandler<CreateCategoryCommand, ResultIdDto>
{
    public CreateCategoryCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        Category category = new(Guid.NewGuid(), request.Name, request.Description, request.IsActive);
        await DbContext.AddAsync(category, cancellationToken);
        return new ResultIdDto { Id = category.Id };
    }
}