using CourseMate.Contracts.Enums;

namespace CourseMate.Contracts.DTOs;

public class LessonDetailDto
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public LessonType LessonType { get; set; }

    public int Position { get; set; }

    public bool IsCompleted { get; set; }
    public double? Score { get; set; }

    // Video
    public string? VideoUrl { get; set; }

    // Reading
    public string? ReadingContent { get; set; }

    // Coding — links to an Exercise
    public Guid? ExerciseId { get; set; }

    public string? ExerciseTitle { get; set; }

    // Quiz
    public string? QuizDescription { get; set; }

    public int? QuizPassingScore { get; set; }

    public List<QuizQuestionDto>? QuizQuestions { get; set; }
}