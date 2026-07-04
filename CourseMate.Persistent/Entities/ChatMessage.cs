using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class ChatMessage : Entity
{
    public ChatMessage(Guid id, Guid conversationId, ChatRole role, string content, string? sourceChunkIds) : base(id)
    {
        ConversationId = conversationId;
        Role = role;
        Content = content;
        SourceChunkIds = sourceChunkIds;
    }

    public Guid ConversationId { get; set; }

    public ChatRole Role { get; set; }

    [MaxLength(CourseMateConsts.ContentMaxLength)]
    public string Content { get; set; }

    [MaxLength(CourseMateConsts.ContentMaxLength)]
    public string? SourceChunkIds { get; set; }
}