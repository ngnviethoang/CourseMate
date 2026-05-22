using System.Net;
using CourseMate.Application.BackgroundJobs;
using CourseMate.Application.Services.NotificationServices;
using CourseMate.Contracts.DTOs;
using Hangfire;
using Microsoft.AspNetCore.Mvc;

namespace CourseMate.API.Controllers;

[ApiController]
[Route("api/dev-tools")]
public class FakeController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public FakeController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpPost("fake-notification")]
    public async Task<ActionResult> FakeNotification(FakeNotificationRequest request)
    {
        if (request.ReceiverId == Guid.Empty)
        {
            return BadRequest(new { message = "ReceiverId is required." });
        }

        NotificationDto result = await _notificationService.CreateAndSendAsync(request.ReceiverId, request.Title, request.Message);
        return Ok(result);
    }

    [HttpPost("fake-email")]
    public ActionResult FakeEmail(FakeEmailRequest request)
    {
        string htmlBody = BuildFakeEmailHtml(request);
        string jobId = BackgroundJob.Enqueue<EmailSenderJob>(job => job.Execute(request.ToEmail, request.Subject, htmlBody));
        return Ok(new { jobId, toEmail = request.ToEmail });
    }

    private static string BuildFakeEmailHtml(FakeEmailRequest request)
    {
        string title = WebUtility.HtmlEncode(request.Title);
        string content = WebUtility.HtmlEncode(request.Content).Replace("\r\n", "<br/>").Replace("\n", "<br/>");
        string actionText = WebUtility.HtmlEncode(request.ActionText);
        string actionUrl = WebUtility.HtmlEncode(request.ActionUrl);

        return $"""
                <!DOCTYPE html>
                <html lang="vi">
                <head>
                    <meta charset="UTF-8"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <title>{title}</title>
                </head>
                <body style="font-family: Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px;">
                    <div style="background-color: #ffffff; border-radius: 12px; max-width: 600px; margin: auto; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
                        <div style="background: linear-gradient(135deg, #0056D2 0%, #0073E6 100%); color: #ffffff; font-size: 24px; padding: 20px 28px; text-align: center; font-weight: bold;">
                            CourseMate Dev Email
                        </div>
                        <div style="font-size: 15px; line-height: 1.7; color: #333333; padding: 28px;">
                            <p style="margin: 0 0 14px;">{content}</p>
                            <div style="text-align: center; margin: 28px 0;">
                                <a href="{actionUrl}" style="display: inline-block; padding: 12px 28px; background: #0056D2; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700;">{actionText}</a>
                            </div>
                            <p style="margin: 0; font-size: 12px; color: #777777;">Đây là email test từ API dev-tools.</p>
                        </div>
                    </div>
                </body>
                </html>
                """;
    }
}