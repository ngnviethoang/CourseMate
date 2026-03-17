using System.ComponentModel.DataAnnotations;
using CourseMate.Contract;
using CourseMate.Core.Entities.Abstracts;

namespace CourseMate.Core.Entities;

public class LessonCoding : Entity
{
    public LessonCoding(Guid id, Guid lessonId, string problemStatement, string starterCode, string expectedOutput) : base(id)
    {
        LessonId = lessonId;
        ProblemStatement = problemStatement;
        StarterCode = starterCode;
        ExpectedOutput = expectedOutput;
    }

    public Guid LessonId { get; set; }

    [MaxLength(CourseMateConsts.ContentMaxLength)]
    public string ProblemStatement { get; set; }

    [MaxLength(CourseMateConsts.ContentMaxLength)]
    public string StarterCode { get; set; }

    [MaxLength(CourseMateConsts.ContentMaxLength)]
    public string ExpectedOutput { get; set; }
}