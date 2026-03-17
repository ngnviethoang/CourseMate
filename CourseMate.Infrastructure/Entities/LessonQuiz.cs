using System.ComponentModel.DataAnnotations;
using CourseMate.Contract;
using CourseMate.Core.Entities.Abstracts;

namespace CourseMate.Core.Entities;

public class LessonQuiz : Entity
{
    public LessonQuiz(Guid id, Guid lessonId, string description, int passingScore) : base(id)
    {
        LessonId = lessonId;
        Description = description;
        PassingScore = passingScore;
    }

    public Guid LessonId { get; set; }

    [MaxLength(CourseMateConsts.DescriptionMaxLength)]
    public string Description { get; set; }

    public int PassingScore { get; set; }
}