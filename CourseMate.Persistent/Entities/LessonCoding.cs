using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

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