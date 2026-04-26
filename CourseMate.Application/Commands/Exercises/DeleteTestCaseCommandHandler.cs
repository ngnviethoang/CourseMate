using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Exercises;

public class DeleteTestCaseCommand : IRequest<int>
{
    public Guid Id { get; set; }
}

internal sealed class DeleteTestCaseCommandHandler : AbstractCommandHandler<DeleteTestCaseCommand, int>
{
    public DeleteTestCaseCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(DeleteTestCaseCommand request, CancellationToken ct)
    {
        await DbContext.ExerciseTestCases.RemoveByIdAsync(request.Id, ct);
        return Codes.Success;
    }
}