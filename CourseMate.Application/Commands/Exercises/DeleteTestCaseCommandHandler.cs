using CourseMate.Application.Shared;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Exercises;

public class DeleteTestCaseCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}

public sealed class DeleteTestCaseCommandHandler : AbstractCommandHandler<DeleteTestCaseCommand, Unit>
{
    public DeleteTestCaseCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<Unit> Handle(DeleteTestCaseCommand request, CancellationToken ct)
    {
        await DbContext.ExerciseTestCases.RemoveByIdAsync(request.Id, ct);
        return Unit.Value;
    }
}