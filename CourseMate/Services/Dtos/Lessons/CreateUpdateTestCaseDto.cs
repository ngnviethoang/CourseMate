namespace CourseMate.Services.Dtos.Lessons;

public class CreateUpdateTestCaseDto
{
    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Input { get; set; } = string.Empty;

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Output { get; set; } = string.Empty;

    public bool IsHidden { get; set; }
}