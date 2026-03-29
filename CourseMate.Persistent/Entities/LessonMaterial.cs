using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class LessonMaterial : Entity
{
    public LessonMaterial(Guid id, Guid lessonId, Guid documentFileId, LessonMaterialState status, string outline, Guid? slideFileId) : base(id)
    {
        LessonId = lessonId;
        Outline = outline;
        SlideFileId = slideFileId;
        DocumentFileId = documentFileId;
        Status = status;
    }

    public Guid LessonId { get; set; }

    [MaxLength(CourseMateConsts.ContentMaxLength)]
    public string Outline { get; set; }

    public Guid? SlideFileId { get; set; }

    public Guid DocumentFileId { get; set; }

    public LessonMaterialState Status { get; set; }
}