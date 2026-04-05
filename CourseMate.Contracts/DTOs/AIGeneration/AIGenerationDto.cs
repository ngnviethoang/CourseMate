using System.Collections.Generic;

namespace CourseMate.Contracts.DTOs.AIGeneration;

public class GenerateLessonRequest
{
    public string RawContent { get; set; } = string.Empty;
}

public class GeneratedLessonDto
{
    public LessonInfoDto LessonInfo { get; set; } = new();
    public List<SlideDto> Slides { get; set; } = new();
}

public class LessonInfoDto
{
    public string Title { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public List<string> LearningOutcomes { get; set; } = new();
}

public class SlideDto
{
    public int SlideNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Type { get; set; } = "content_slide";
    public List<string> BulletPoints { get; set; } = new();
    public string ExplanationForTeacher { get; set; } = string.Empty;
    public string VisualIdea { get; set; } = string.Empty;
}
