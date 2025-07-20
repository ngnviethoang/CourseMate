using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace CourseMate.Entities.Lessons;

public class Lesson : FullAuditedEntity<Guid>
{
    public Lesson(Guid id, LessonType type, Guid chapterId,
        int position, string title, string content,
        string? videoFile = null, TimeSpan duration = default,
        string? codeSampleJson = null, string? optionsJson = null,
        string? correctAnswerJson = null, string? explanation = null) : base(id)
    {
        Type = type;
        ChapterId = chapterId;
        Position = position;
        Title = title;
        Content = content;
        VideoFile = videoFile;
        Duration = duration;
        CodeSampleJson = codeSampleJson;
        OptionsJson = optionsJson;
        CorrectAnswerJson = correctAnswerJson;
        Explanation = explanation;
    }

    public LessonType Type { get; set; }

    public Guid ChapterId { get; set; }

    public int Position { get; set; }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Title { get; set; }

    [MaxLength]
    public string Content { get; set; }

    // Video fields
    [MaxLength(CourseMateConst.FileNameMaxLength)]
    public string? VideoFile { get; set; }

    public TimeSpan Duration { get; set; }

    // Coding fields (serialized)
    [MaxLength(CourseMateConst.DescriptionMaxLength)]
    public string? CodeSampleJson { get; set; }

    // Quiz fields (serialized)
    [MaxLength(CourseMateConst.DescriptionMaxLength)]
    public string? OptionsJson { get; set; }

    [MaxLength(CourseMateConst.DescriptionMaxLength)]
    public string? CorrectAnswerJson { get; set; }

    [MaxLength(CourseMateConst.DescriptionMaxLength)]
    public string? Explanation { get; set; }

    // Not mapped, helper for Coding
    [NotMapped]
    public Dictionary<LanguageType, string>? CodeSample
    {
        get => string.IsNullOrWhiteSpace(CodeSampleJson) ? null : JsonSerializer.Deserialize<Dictionary<LanguageType, string>>(CodeSampleJson);
        set => CodeSampleJson = JsonSerializer.Serialize(value);
    }

    // Not mapped, helper for Quiz
    [NotMapped]
    public Dictionary<int, string>? Options
    {
        get => string.IsNullOrWhiteSpace(OptionsJson) ? null : JsonSerializer.Deserialize<Dictionary<int, string>>(OptionsJson);
        set => OptionsJson = JsonSerializer.Serialize(value);
    }

    [NotMapped]
    public IEnumerable<int>? CorrectAnswer
    {
        get => string.IsNullOrWhiteSpace(CorrectAnswerJson) ? null : JsonSerializer.Deserialize<IEnumerable<int>>(CorrectAnswerJson);
        set => CorrectAnswerJson = JsonSerializer.Serialize(value);
    }
}