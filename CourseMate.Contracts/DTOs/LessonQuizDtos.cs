namespace CourseMate.Contracts.DTOs;

public class QuizQuestionDto
{
    public Guid Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public int Position { get; set; }
    public List<QuizAnswerDto> Answers { get; set; } = new();
}

public class QuizAnswerDto
{
    public Guid Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
    public int Position { get; set; }
}

public class UpsertLessonQuizRequest
{
    public string Description { get; set; } = string.Empty;
    public int PassingScore { get; set; }
    public List<QuizQuestionDto> Questions { get; set; } = new();
}