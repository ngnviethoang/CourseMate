namespace CourseMate.Services.Dtos.Lessons;

public class QuizOptionDto : EntityDto<Guid>
{
    public Guid QuizQuestionId { get; set; }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Text { get; set; } = string.Empty;

    public bool IsCorrect { get; set; }
}