namespace CourseMate.Application.Services.AIServices;

public sealed record RetrievedChunk(Guid FileEntryId, Guid FileChunkId, string Text, string ShortText, double Distance);