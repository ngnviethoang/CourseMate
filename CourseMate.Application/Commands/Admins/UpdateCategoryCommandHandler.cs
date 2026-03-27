using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Admins;

internal sealed class UpdateCategoryAbstractCommandHandler : AbstractCommandHandler<UpdateCategoryCommand, int>
{
    public UpdateCategoryAbstractCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        Category? category = await DbContext.Categories.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (category == null)
        {
            throw new EntityNotFoundException(nameof(Category), request.Id);
        }

        category.Name = request.Name;
        category.Description = request.Description;
        category.IsActive = request.IsActive;

        DbContext.Update(category);
        return Codes.Success;
    }
}