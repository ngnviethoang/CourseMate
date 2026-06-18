namespace CourseMate.Contracts.DTOs.Chat;

public class ChatSourceDto
{
    public Guid FileChunkId { get; set; }
    public Guid FileEntryId { get; set; }
    public string ShortText { get; set; } = string.Empty;
}
