using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Admins;

public class DeleteChapterCommand : IRequest<int>
{
    public Guid Id { get; set; }
}

internal sealed class DeleteChapterAbstractCommandHandler : AbstractCommandHandler<DeleteChapterCommand, int>
{
    public DeleteChapterAbstractCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(DeleteChapterCommand request, CancellationToken cancellationToken)
    {
        await DbContext.Chapters.RemoveByIdAsync(request.Id, cancellationToken);
        return Codes.Success;
    }
}