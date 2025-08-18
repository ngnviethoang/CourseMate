namespace CourseMate.Services.Dtos.Lessons;

public class CreateUpdateQuizOptionDto
{
    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Text { get; set; } = string.Empty;

    public bool IsCorrect { get; set; }
}