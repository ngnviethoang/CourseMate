namespace CourseMate.Contracts.DTOs;

public class UpsertLessonVideoRequest
{
    public string VideoUrl { get; set; } = string.Empty;
}

public class UpsertLessonReadingRequest
{
    public string Content { get; set; } = string.Empty;
}

public class UpsertLessonCodingRequest
{
    public Guid ExerciseId { get; set; }
}

public class UpsertLessonSlideRequest
{
    public string FileUrl { get; set; } = string.Empty;
}