namespace CourseMate.Services.Dtos.Lessons;

public class CodingExerciseDto : EntityDto<Guid>
{
    public Guid LessonId { get; set; }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(CourseMateConst.DescriptionMaxLength)]
    public string Description { get; set; } = string.Empty;

    public IEnumerable<SampleCodeDto> SampleCodes { get; set; } = [];
    public IEnumerable<TestCaseDto> TestCases { get; set; } = [];
}