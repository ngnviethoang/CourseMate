using CourseMate.Application.Shared;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Categories;

public class DeleteCategoryCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}

internal sealed class DeleteCategoryAbstractCommandHandler : AbstractCommandHandler<DeleteCategoryCommand, Unit>
{
    public DeleteCategoryAbstractCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<Unit> Handle(DeleteCategoryCommand request, CancellationToken ct)
    {
        await DbContext.Categories.RemoveByIdAsync(request.Id, ct);
        return Unit.Value;
    }
}