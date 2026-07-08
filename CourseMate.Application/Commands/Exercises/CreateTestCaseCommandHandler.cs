using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Exercises;

public sealed class CreateTestCaseCommand : IRequest<ResultIdDto>
{
    public Guid ExerciseId { get; set; }
    public string Input { get; set; } = string.Empty;
    public string ExpectedOutput { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsHidden { get; set; }
    public int Order { get; set; }
}

public sealed class CreateTestCaseCommandHandler : AbstractCommandHandler<CreateTestCaseCommand, ResultIdDto>
{
    public CreateTestCaseCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(CreateTestCaseCommand request, CancellationToken ct)
    {
        await DbContext.Exercises.EnsureExistsAsync(request.ExerciseId, ct);
        ExerciseTestCase testCase = new(
            Guid.NewGuid(),
            request.ExerciseId,
            request.Input,
            request.ExpectedOutput,
            request.Description,
            request.IsHidden,
            request.Order
        );

        await DbContext.ExerciseTestCases.AddAsync(testCase, ct);
        return new ResultIdDto { Id = testCase.Id };
    }
}