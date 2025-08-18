namespace CourseMate.Services.Dtos.Lessons;

public class CreateUpdateQuizQuestionDto
{
    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string QuestionText { get; set; } = string.Empty;

    public IEnumerable<CreateUpdateQuizOptionDto> QuizOptions { get; set; } = [];
}