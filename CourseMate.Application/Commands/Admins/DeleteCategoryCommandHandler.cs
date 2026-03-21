using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.ExtensionMethods;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Admins;

internal sealed class DeleteCategoryAbstractCommandHandler : AbstractCommandHandler<DeleteCategoryCommand>
{
    public DeleteCategoryAbstractCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        await DbContext.Categories.RemoveByIdAsync(request.Id, cancellationToken);
        await DbContext.SaveChangesAsync(cancellationToken);
    }
}