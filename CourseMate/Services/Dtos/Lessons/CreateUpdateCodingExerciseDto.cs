namespace CourseMate.Services.Dtos.Lessons;

public class CreateUpdateCodingExerciseDto
{
    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(CourseMateConst.DescriptionMaxLength)]
    public string Description { get; set; } = string.Empty;

    public IEnumerable<CreateUpdateSampleCodeDto> SampleCodes { get; set; } = [];
    public IEnumerable<CreateUpdateTestCaseDto> TestCases { get; set; } = [];
}