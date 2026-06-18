namespace CourseMate.Contracts.DTOs.Chat;

public class SendChatMessageRequest
{
    public Guid? ConversationId { get; set; }
    public Guid? CourseId { get; set; }
    public Guid? LessonId { get; set; }
    public string Text { get; set; } = string.Empty;
}
