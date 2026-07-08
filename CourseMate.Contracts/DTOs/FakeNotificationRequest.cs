using System.ComponentModel.DataAnnotations;

namespace CourseMate.Contracts.DTOs;

public class FakeNotificationRequest
{
    [Required]
    public Guid ReceiverId { get; set; }

    [Required]
    [MaxLength(120)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(2000)]
    public string Message { get; set; } = string.Empty;
}