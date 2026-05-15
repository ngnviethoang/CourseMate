using System.Security.Claims;
using CourseMate.Application.Commands.Contests;
using CourseMate.Contracts.DTOs.AntiCheat;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace CourseMate.API.Hubs;

[Authorize]
public class ContestHub : Hub
{
    private readonly IMediator _mediator;

    public ContestHub(IMediator mediator)
    {
        _mediator = mediator;
    }

    private Guid GetCurrentUserId()
    {
        string? userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(userId, out Guid id) ? id : Guid.Empty;
    }

    /// <summary>
    ///     Student joins their contest room for receiving anti-cheat events.
    /// </summary>
    public async Task JoinContest(Guid contestId)
    {
        Guid userId = GetCurrentUserId();
        await Groups.AddToGroupAsync(Context.ConnectionId, $"contest:{contestId}");
        await Groups.AddToGroupAsync(Context.ConnectionId, $"contest:{contestId}:student:{userId}");
    }

    /// <summary>
    ///     Instructor joins the monitor room to receive real-time violation events.
    /// </summary>
    public async Task JoinContestMonitor(Guid contestId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"contest:{contestId}:instructors");
    }

    /// <summary>
    ///     Student reports a violation detected by the frontend anti-cheat monitor.
    /// </summary>
    public async Task ReportViolation(ReportViolationRequest request)
    {
        Guid userId = GetCurrentUserId();

        ReportViolationCommand command = new()
        {
            ContestId = request.ContestId,
            ViolationType = request.ViolationType,
            Details = request.Details,
            Timestamp = request.Timestamp
        };

        ViolationResultDto result = await _mediator.Send(command);

        if (result.IsDisqualified)
        {
            await Clients.Caller.SendAsync("ForceDisqualify", new
            {
                reason = result.Message,
                disqualifiedAt = DateTimeOffset.UtcNow
            });
        }
        else
        {
            await Clients.Caller.SendAsync("ViolationWarning", new
            {
                violationCount = result.ViolationCount,
                maxViolations = result.MaxViolations,
                message = result.Message
            });
        }

        // Notify instructors watching this contest
        string? userName = Context.User?.FindFirstValue(ClaimTypes.Name)
                           ?? Context.User?.FindFirstValue("name")
                           ?? "Unknown";

        await Clients.Group($"contest:{request.ContestId}:instructors")
            .SendAsync("StudentViolation", new
            {
                studentId = userId,
                studentName = userName,
                violationType = request.ViolationType,
                violationCount = result.ViolationCount,
                maxViolations = result.MaxViolations,
                isDisqualified = result.IsDisqualified,
                timestamp = DateTimeOffset.UtcNow
            });
    }

    /// <summary>
    ///     Instructor manually disqualifies a student.
    /// </summary>
    public async Task DisqualifyStudent(Guid contestId, Guid studentId, string reason)
    {
        DisqualifyStudentCommand command = new()
        {
            ContestId = contestId,
            StudentId = studentId,
            Reason = reason
        };

        await _mediator.Send(command);

        // Notify the student
        await Clients.Group($"contest:{contestId}:student:{studentId}")
            .SendAsync("ForceDisqualify", new
            {
                reason = $"Manual: {reason}",
                disqualifiedAt = DateTimeOffset.UtcNow
            });

        // Notify all instructors
        await Clients.Group($"contest:{contestId}:instructors")
            .SendAsync("StudentDisqualified", new
            {
                studentId,
                reason = $"Manual: {reason}",
                disqualifiedAt = DateTimeOffset.UtcNow
            });
    }

    /// <summary>
    ///     Instructor reinstates a previously disqualified student.
    /// </summary>
    public async Task ReinstateStudent(Guid contestId, Guid studentId)
    {
        ReinstateStudentCommand command = new()
        {
            ContestId = contestId,
            StudentId = studentId
        };

        await _mediator.Send(command);

        // Notify the student
        await Clients.Group($"contest:{contestId}:student:{studentId}")
            .SendAsync("StudentReinstated", new
            {
                message = "You have been reinstated in the contest."
            });

        // Notify all instructors
        await Clients.Group($"contest:{contestId}:instructors")
            .SendAsync("StudentReinstated", new
            {
                studentId,
                reinstatedAt = DateTimeOffset.UtcNow
            });
    }
}