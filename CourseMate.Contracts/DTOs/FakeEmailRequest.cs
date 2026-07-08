using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts.Attributes;

namespace CourseMate.Contracts.DTOs;

public class FakeEmailRequest
{
    [Required]
    [EmailAddress]
    [SensitiveData]
    [MaxLength(254)]
    public string ToEmail { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Subject { get; set; } = "Subject";

    [Required]
    [MaxLength(3000)]
    public string Title { get; set; } = "Test Email";

    [Required]
    [MaxLength(5000)]
    public string Content { get; set; } = "This is a fake email for testing.";

    [Required]
    [MaxLength(100)]
    public string ActionText { get; set; } = "Open CourseMate";

    [Required]
    [Url]
    [MaxLength(2048)]
    public string ActionUrl { get; set; } = "http://localhost:3000";
}