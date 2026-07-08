using CourseMate.Application.BackgroundJobs;
using CourseMate.Contracts.Enums;
using Hangfire;
using MediatR;

namespace CourseMate.Application.Events;

public sealed record LessonMaterialCreatedEvent(
    Guid LessonMaterialId,
    Guid LessonId,
    LessonMaterialPromptType PromptType
) : INotification;

public sealed class LessonMaterialCreatedEventHandler : INotificationHandler<LessonMaterialCreatedEvent>
{
    public Task Handle(LessonMaterialCreatedEvent notification, CancellationToken ct)
    {
        string embeddingJobId = BackgroundJob.Enqueue<GenerateLessonMaterialEmbeddingJob>(job => job.ExecuteAsync(notification.LessonMaterialId, ct));
        BackgroundJob.ContinueJobWith<GenerateOutlineJob>(embeddingJobId, job => job.ExecuteAsync(notification.LessonMaterialId, notification.PromptType, ct));
        return Task.CompletedTask;
    }
}