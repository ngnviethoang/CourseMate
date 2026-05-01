using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Exercises;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CourseMate.Application.Queries.Exercises;

public class GetStudentExerciseByIdQuery : IRequest<GetStudentExerciseByIdResponse?>
{
    public Guid Id { get; set; }
}

internal sealed class GetStudentExerciseByIdQueryHandler : AbstractQueryHandler<GetStudentExerciseByIdQuery, GetStudentExerciseByIdResponse?>
{
    public GetStudentExerciseByIdQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<GetStudentExerciseByIdResponse?> Handle(GetStudentExerciseByIdQuery request, CancellationToken ct)
    {
        GetStudentExerciseByIdResponse? result = await (
            from exercise in DbContext.Exercises
            join user in DbContext.Users
                on exercise.CreatorId equals user.Id
            where exercise.Id == request.Id
            select new GetStudentExerciseByIdResponse
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
            }).FirstOrDefaultAsync(ct);

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
            .ToListAsync(ct);

        // Trả về TOÀN BỘ test cases (kể cả IsHidden = true) để Frontend có thể chạy code
        result.TestCases = await DbContext.ExerciseTestCases
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
            .ToListAsync(ct);

        result.TestCaseCount = result.TestCases.Count();

        result.DefaultCodes = await DbContext.ExerciseDefaultCodes
            .Where(x => x.ExerciseId == result.Id)
            .Select(i => new ExerciseDefaultCodeDto
            {
                Id = i.Id,
                Language = i.Language,
                StarterCode = i.StarterCode
            })
            .ToListAsync(ct);

        return result;
    }
}
