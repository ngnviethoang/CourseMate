using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Admins;

public class DeleteCategoryCommand : IRequest<int>
{
    public Guid Id { get; set; }
}

internal sealed class DeleteCategoryAbstractCommandHandler : AbstractCommandHandler<DeleteCategoryCommand, int>
{
    public DeleteCategoryAbstractCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        await DbContext.Categories.RemoveByIdAsync(request.Id, cancellationToken);
        return Codes.Success;
    }
}