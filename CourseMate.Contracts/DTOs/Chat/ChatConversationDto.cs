namespace CourseMate.Contracts.DTOs.Chat;

public class ChatConversationDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public Guid? CourseId { get; set; }
    public Guid? LessonId { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}