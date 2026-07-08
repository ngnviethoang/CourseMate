using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Exercises;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Exercises;

public class GetStudentExerciseSubmissionsQuery : IRequest<IEnumerable<ExerciseSubmissionDto>>
{
    public Guid ExerciseId { get; set; }
}

public sealed class GetStudentExerciseSubmissionsQueryHandler : AbstractQueryHandler<GetStudentExerciseSubmissionsQuery, IEnumerable<ExerciseSubmissionDto>>
{
    public GetStudentExerciseSubmissionsQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<IEnumerable<ExerciseSubmissionDto>> Handle(GetStudentExerciseSubmissionsQuery request, CancellationToken ct)
    {
        return await DbContext.ExerciseSubmissions
            .Where(x => x.ExerciseId == request.ExerciseId && x.UserId == CurrentUserId)
            .OrderByDescending(x => x.CreationTime)
            .Select(i => new ExerciseSubmissionDto
            {
                Id = i.Id,
                Language = i.Language,
                Code = i.Code,
                Passed = i.IsPassed,
                Score = i.Score,
                TotalTime = i.TotalTime,
                TotalMemory = i.TotalMemory,
                CreationTime = i.CreationTime
            })
            .ToListAsync(ct);
    }
}