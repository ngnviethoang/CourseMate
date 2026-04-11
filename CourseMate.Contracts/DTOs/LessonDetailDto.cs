using CourseMate.Contracts.Enums;

namespace CourseMate.Contracts.DTOs;

public class LessonDetailDto
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public LessonType LessonType { get; set; }

    public int Position { get; set; }

    public bool IsCompleted { get; set; }

    public string? VideoUrl { get; set; }

    public string? ReadingContent { get; set; }

    public string? ProblemStatement { get; set; }

    public string? StarterCode { get; set; }

    public string? ExpectedOutput { get; set; }

    public string? QuizDescription { get; set; }

    public int? QuizPassingScore { get; set; }
}