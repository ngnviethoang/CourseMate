using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Exercises;

public class GetExerciseByIdQuery : IRequest<GetExerciseByIdResponse?>
{
    public Guid Id { get; set; }
}

internal sealed class GetExerciseByIdQueryHandler : AbstractQueryHandler<GetExerciseByIdQuery, GetExerciseByIdResponse?>
{
    public GetExerciseByIdQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<GetExerciseByIdResponse?> Handle(GetExerciseByIdQuery request, CancellationToken cancellationToken)
    {
        GetExerciseByIdResponse? result = await (
            from exercise in DbContext.Exercises
            join user in DbContext.Users
                on exercise.CreatorId equals user.Id
            where exercise.Id == request.Id
            select new GetExerciseByIdResponse
            {
                Id = exercise.Id,
                Title = exercise.Title,
                Description = exercise.Description,
                Difficulty = exercise.Difficulty.ToString(),
                Category = exercise.Category,
                CreatedById = exercise.CreatorId,
                CreatedByName = user.UserName,
                CreationTime = exercise.CreationTime,
                LastModificationTime = exercise.LastModificationTime,
                Constraints = exercise.Constraints,
                Hints = exercise.Hints
            }).FirstOrDefaultAsync(cancellationToken);

        if (result is null)
        {
            return null;
        }

        result.Examples = await DbContext.ExerciseExamples.Where(x => x.ExerciseId == result.Id)
            .Select(i => new ExerciseExampleDto
            {
                Input = i.Input,
                Output = i.Output,
                Explanation = i.Explanation
            })
            .ToListAsync(cancellationToken);

        result.TestCases = await DbContext.ExerciseTestCases
            .WhereIf(IsInRole(Roles.Student), x => !x.IsHidden)
            .Where(x => x.ExerciseId == result.Id)
            .Select(i => new ExerciseTestCaseDto
            {
                Id = i.Id,
                Input = i.Input,
                ExpectedOutput = i.ExpectedOutput,
                Description = i.Description,
                IsHidden = i.IsHidden,
                Order = i.Order
            })
            .ToListAsync(cancellationToken);

        result.TestCaseCount = await DbContext.ExerciseTestCases
            .Where(x => x.ExerciseId == result.Id)
            .CountAsync(cancellationToken);

        result.DefaultCodes = await DbContext.ExerciseDefaultCodes
            .Where(x => x.ExerciseId == result.Id)
            .Select(i => new ExerciseDefaultCodeDto
            {
                Id = i.Id,
                Language = i.Language,
                StarterCode = i.StarterCode
            })
            .ToListAsync(cancellationToken);

        return result;
    }
}