using CourseMate.Application.Shared;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Categories;

public class UpdateCategoryCommand : IRequest<Unit>
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}

internal sealed class UpdateCategoryAbstractCommandHandler : AbstractCommandHandler<UpdateCategoryCommand, Unit>
{
    public UpdateCategoryAbstractCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<Unit> Handle(UpdateCategoryCommand request, CancellationToken ct)
    {
        Category? category = await DbContext.Categories.FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (category == null)
        {
            throw new EntityNotFoundException(nameof(Category), request.Id);
        }

        category.Name = request.Name;
        category.Description = request.Description;
        category.IsActive = request.IsActive;

        DbContext.Update(category);
        return Unit.Value;
    }
}