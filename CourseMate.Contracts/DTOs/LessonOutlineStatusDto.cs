using CourseMate.Contracts.Enums;

namespace CourseMate.Contracts.DTOs;

public class LessonOutlineStatusDto
{
    public Guid LessonId { get; set; }
    public Guid? LessonMaterialId { get; set; }
    public LessonMaterialState? Status { get; set; }
    public bool IsReady { get; set; }
}
