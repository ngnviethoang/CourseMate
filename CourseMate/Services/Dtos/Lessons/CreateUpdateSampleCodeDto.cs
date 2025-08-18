using CourseMate.Entities.Lessons;

namespace CourseMate.Services.Dtos.Lessons;

public class CreateUpdateSampleCodeDto
{
    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Code { get; set; } = string.Empty;

    public LanguageType LanguageType { get; set; }
}