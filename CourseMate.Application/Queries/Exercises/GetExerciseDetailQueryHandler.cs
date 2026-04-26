using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using MediatR;
using CourseMate.Contracts.Constants;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Exercises;

public class GetExerciseDetailQuery : IRequest<ExerciseDetailDto>
{
    public Guid Id { get; set; }
}

internal sealed class GetExerciseDetailQueryHandler
    : AbstractQueryHandler<GetExerciseDetailQuery, ExerciseDetailDto>
{
    public GetExerciseDetailQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor) { }

    public override async Task<ExerciseDetailDto> Handle(GetExerciseDetailQuery request, CancellationToken cancellationToken)
    {
        var exercise = await DbContext.Exercises
            .Include(x => x.TestCases)
            .Include(x => x.DefaultCodes)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (exercise is null)
            throw new EntityNotFoundException("Exercise", request.Id);

        var creator = await DbContext.Users
            .Where(u => u.Id == exercise.CreatedById)
            .Select(u => u.UserName)
            .FirstOrDefaultAsync(cancellationToken);

        var result = new ExerciseDetailDto
        {
            Id = exercise.Id,
            Title = exercise.Title,
            Description = exercise.Description,
            Difficulty = exercise.Difficulty.ToString(),
            Category = exercise.Category,
            CreatedById = exercise.CreatedById,
            CreatedByName = creator,
            CreationTime = exercise.CreationTime,
            LastModificationTime = exercise.LastModificationTime,
            Examples = exercise.Examples.Select(e => new ExerciseExampleDto
            {
                Input = e.Input,
                Output = e.Output,
                Explanation = e.Explanation
            }).ToList(),
            Constraints = exercise.Constraints,
            Hints = exercise.Hints,
            TestCaseCount = exercise.TestCases.Count(tc => !tc.IsDeleted),
            TestCases = exercise.TestCases
                .Where(tc => !tc.IsDeleted)
                .OrderBy(tc => tc.Order)
                .Select(tc => new ExerciseTestCaseDto
                {
                    Id = tc.Id,
                    Input = tc.Input,
                    ExpectedOutput = tc.ExpectedOutput,
                    Description = tc.Description,
                    IsHidden = tc.IsHidden,
                    Order = tc.Order
                }).ToList(),
            DefaultCodes = exercise.DefaultCodes
                .Where(dc => !dc.IsDeleted)
                .Select(dc => new ExerciseDefaultCodeDto
                {
                    Id = dc.Id,
                    Language = dc.Language,
                    StarterCode = dc.StarterCode
                }).ToList()
        };
        
        if (IsInRole(Roles.Student))
        {
            // Chỉ trả về các test case công khai cho học sinh
            result.TestCases = result.TestCases.Where(tc => !tc.IsHidden).ToList();
        }

        return result;
    }
}
