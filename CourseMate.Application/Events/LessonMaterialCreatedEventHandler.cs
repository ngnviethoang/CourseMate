using CourseMate.Application.BackgroundJobs;
using Hangfire;
using MediatR;

namespace CourseMate.Application.Events;

internal sealed record LessonMaterialCreatedEvent(
    Guid LessonMaterialId,
    Guid FileEntryId,
    Guid LessonId
) : INotification;

internal sealed class LessonMaterialCreatedEventHandler : INotificationHandler<LessonMaterialCreatedEvent>
{
    public Task Handle(LessonMaterialCreatedEvent notification, CancellationToken ct)
    {
        string embeddingJobId = BackgroundJob.Enqueue<ProcessFileEmbeddingJob>(job => job.ExecuteAsync(notification.FileEntryId, ct));
        BackgroundJob.ContinueJobWith<GenerateOutlineJob>(embeddingJobId, job => job.ExecuteAsync(notification.LessonMaterialId, ct));
        return Task.CompletedTask;
    }
}