namespace CourseMate.Services.Dtos.Lessons;

public class QuizQuestionDto : EntityDto<Guid>
{
    public Guid LessonId { get; set; }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string QuestionText { get; set; } = string.Empty;

    public IEnumerable<QuizOptionDto> QuizOptions { get; set; } = [];
}