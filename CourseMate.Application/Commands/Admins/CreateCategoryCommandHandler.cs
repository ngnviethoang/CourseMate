using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Admins;

public class CreateCategoryCommand : IRequest<ResultIdDto>
{
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}

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