using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.DTOs.Exercises;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using CourseMate.Application.Services.CodeRunnerServices;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Contests;

public class SubmitContestExerciseCommand : IRequest<SubmitExerciseResponse>
{
    public Guid ContestId { get; set; }
    public Guid ExerciseId { get; set; }
    public SubmitExerciseRequest Payload { get; set; } = new();
}

public sealed class SubmitContestExerciseCommandHandler : AbstractCommandHandler<SubmitContestExerciseCommand, SubmitExerciseResponse>
{
    private readonly ICodeRunnerService _codeRunnerService;

    public SubmitContestExerciseCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor, ICodeRunnerService codeRunnerService)
        : base(dbContext, httpContextAccessor)
    {
        _codeRunnerService = codeRunnerService;
    }

    public override async Task<SubmitExerciseResponse> Handle(SubmitContestExerciseCommand request, CancellationToken ct)
    {
        // Check registration and status
        ContestRegistration? registration = await DbContext.ContestRegistrations
            .FirstOrDefaultAsync(x => x.ContestId == request.ContestId && x.StudentId == CurrentUserId, ct);

        if (registration == null)
        {
            throw new UnauthorizedAccessException("You are not registered for this contest.");
        }

        if (registration.IsDisqualified)
        {
            throw new BusinessException(ErrorCode.Unknown, "You have been disqualified from this contest.");
        }

        if (registration.SubmitTime.HasValue)
        {
            throw new BusinessException(ErrorCode.Unknown, "You have already submitted your final contest entry.");
        }

        Contest? contest = await DbContext.Contests.FindAsync([request.ContestId], ct);
        if (contest == null || contest.Status != ContestStatus.Ongoing)
        {
            // Allow submission if within duration after JoinTime even if Contest status is Ended?
            // Usually contest ends for everyone at EndTime.
            if (contest?.EndTime.HasValue == true && contest.EndTime.Value < DateTimeOffset.UtcNow)
            {
                throw new BusinessException(ErrorCode.Unknown, "Contest has ended.");
            }
        }

        if (contest != null && registration.JoinTime.HasValue)
        {
            var userEndTime = registration.JoinTime.Value.AddMinutes(contest.DurationInMinutes);
            // Allow a small grace period (10 seconds) for network latency
            if (DateTimeOffset.UtcNow > userEndTime.AddSeconds(10))
            {
                throw new BusinessException(ErrorCode.Unknown, "Your contest time has expired.");
            }
        }

        // Calculate score weight
        ContestExercise? ce = await DbContext.ContestExercises
            .FirstOrDefaultAsync(x => x.ContestId == request.ContestId && x.ExerciseId == request.ExerciseId, ct);

        if (ce == null)
        {
            throw new BusinessException(ErrorCode.Unknown, "Exercise is not part of this contest.");
        }

        // Fetch test cases for this exercise
        var testCases = await DbContext.ExerciseTestCases
            .Where(x => x.ExerciseId == request.ExerciseId)
            .OrderBy(x => x.Order)
            .ToListAsync(ct);

        int passedCount = 0;
        float maxTime = 0;
        int maxMemory = 0;
        var testResults = new List<TestResultDto>();

        foreach (var tc in testCases)
        {
            var runResponse = await _codeRunnerService.RunAsync(request.Payload.Code, request.Payload.Language, tc.Input, ct);
            
            string actual = (runResponse.Output ?? string.Empty).Trim();
            string expected = (tc.ExpectedOutput ?? string.Empty).Trim();
            bool isPassed = !string.IsNullOrEmpty(actual) && actual == expected && string.IsNullOrEmpty(runResponse.Error);

            if (isPassed) passedCount++;

            // Accumulate max time and memory
            if (float.TryParse(runResponse.Time, out float time) && time > maxTime) maxTime = time;
            if (int.TryParse(runResponse.Memory, out int memory) && memory > maxMemory) maxMemory = memory;

            testResults.Add(new TestResultDto
            {
                Passed = isPassed,
                IsHidden = tc.IsHidden,
                ExpectedOutput = tc.ExpectedOutput ?? string.Empty,
                ActualOutput = !string.IsNullOrEmpty(runResponse.Error) ? runResponse.Error : (runResponse.Output ?? string.Empty),
                Description = tc.Description ?? string.Empty
            });
        }

        // Score based on passed test cases ratio
        int weightedScore = 0;
        if (testCases.Count > 0)
        {
            weightedScore = (int)((float)passedCount / testCases.Count * ce.ScoreWeight);
        }

        ContestSubmission submission = new(
            Guid.NewGuid(),
            request.ContestId,
            request.ExerciseId,
            CurrentUserId,
            request.Payload.Language,
            request.Payload.Code,
            weightedScore,
            maxTime,
            maxMemory,
            DateTimeOffset.UtcNow,
            true 
        );

        await DbContext.ContestSubmissions.AddAsync(submission, ct);
        await DbContext.SaveChangesAsync(ct);

        return new SubmitExerciseResponse
        {
            SubmissionId = submission.Id,
            TestResults = testResults
        };
    }
}