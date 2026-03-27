using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class LessonMaterial : Entity
{
    public LessonMaterial(Guid id, Guid lessonId, string documentFilePath, string parsedContent, string outline, string slideFilePath, DocumentProcessingStatus status, string hangfireJobId) : base(id)
    {
        LessonId = lessonId;
        DocumentFilePath = documentFilePath;
        ParsedContent = parsedContent;
        Outline = outline;
        SlideFilePath = slideFilePath;
        Status = status;
        HangfireJobId = hangfireJobId;
    }

    public Guid LessonId { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string DocumentFilePath { get; set; }

    [MaxLength(CourseMateConsts.ContentMaxLength)]
    public string ParsedContent { get; set; }

    [MaxLength(CourseMateConsts.ContentMaxLength)]
    public string Outline { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string SlideFilePath { get; set; }

    public DocumentProcessingStatus Status { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string HangfireJobId { get; set; }
}