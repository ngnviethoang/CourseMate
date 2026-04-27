using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Exercises;

public class UpdateTestCaseCommand : IRequest<int>
{
    public Guid Id { get; set; }
    public string Input { get; set; } = string.Empty;
    public string ExpectedOutput { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsHidden { get; set; }
    public int Order { get; set; }
}

internal sealed class UpdateTestCaseCommandHandler : AbstractCommandHandler<UpdateTestCaseCommand, int>
{
    public UpdateTestCaseCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(UpdateTestCaseCommand request, CancellationToken ct)
    {
        ExerciseTestCase? testCase = await DbContext.ExerciseTestCases.FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (testCase is null)
        {
            throw new EntityNotFoundException(nameof(ExerciseTestCase), request.Id);
        }

        testCase.Input = request.Input;
        testCase.ExpectedOutput = request.ExpectedOutput;
        testCase.Description = request.Description;
        testCase.IsHidden = request.IsHidden;
        testCase.Order = request.Order;

        return Codes.Success;
    }
}