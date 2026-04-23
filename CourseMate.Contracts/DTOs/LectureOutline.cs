using System.Text.Json.Serialization;

namespace CourseMate.Contracts.DTOs;

public class LectureOutline
{
    [JsonPropertyName("lessonTitle")]
    public string LessonTitle { get; set; } = string.Empty;

    [JsonPropertyName("relatedLinks")]
    public List<string> RelatedLinks { get; set; } = [];

    [JsonPropertyName("slides")]
    public List<LectureSlide> Slides { get; set; } = [];
}

public class LectureSlide
{
    [JsonPropertyName("slideNumber")]
    public int SlideNumber { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("bullets")]
    public List<string> Bullets { get; set; } = [];

    [JsonPropertyName("relatedLinks")]
    public List<string> RelatedLinks { get; set; } = [];
}