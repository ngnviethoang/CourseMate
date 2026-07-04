namespace CourseMate.Application.Services.AIServices;

public interface IChatRetrievalService
{
    Task<IReadOnlyList<RetrievedChunk>> RetrieveAsync(
        ReadOnlyMemory<float> queryVector,
        Guid? courseId,
        Guid? lessonId,
        int topK,
        CancellationToken ct);
}