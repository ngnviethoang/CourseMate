namespace CourseMate.Contracts.DTOs;

public class QuizQuestionDto
{
    public Guid Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public int Position { get; set; }
    public List<QuizAnswerDto> Answers { get; set; } = [];
}