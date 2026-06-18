using CourseMate.Application.BackgroundJobs;
using Hangfire;
using MediatR;

namespace CourseMate.Application.Events;

public sealed record CourseSavedEvent(Guid CourseId) : INotification;

public sealed class CourseSavedEventHandler : INotificationHandler<CourseSavedEvent>
{
    public Task Handle(CourseSavedEvent notification, CancellationToken ct)
    {
        BackgroundJob.Enqueue<GenerateCourseEmbeddingJob>(job => job.ExecuteAsync(notification.CourseId, ct));
        return Task.CompletedTask;
    }
}
