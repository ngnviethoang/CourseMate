namespace CourseMate.Contracts.DTOs.Chat;

public class ChatAnswerDto
{
    public Guid ConversationId { get; set; }
    public Guid MessageId { get; set; }
    public string Answer { get; set; } = string.Empty;
    public List<ChatSourceDto> Sources { get; set; } = [];
}