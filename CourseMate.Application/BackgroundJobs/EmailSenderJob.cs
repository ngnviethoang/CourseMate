using CourseMate.Contracts.Options;
using Hangfire;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;

namespace CourseMate.Application.BackgroundJobs;

public class EmailSenderJob
{
    private readonly ILogger<EmailSenderJob> _logger;
    private readonly SmtpOptions _smtpOptions;

    public EmailSenderJob(ILogger<EmailSenderJob> logger, IOptions<SmtpOptions> smtpOptions)
    {
        _logger = logger;
        _smtpOptions = smtpOptions.Value;
    }

    [AutomaticRetry(Attempts = 3)]
    public async Task Execute(MimeMessage mimeMessage)
    {
        _logger.LogInformation("Sending email to {To}", string.Join(", ", mimeMessage.To));
        try
        {
            using SmtpClient client = new();
            await client.ConnectAsync(_smtpOptions.Host, _smtpOptions.Port, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_smtpOptions.UserName, _smtpOptions.Password);
            await client.SendAsync(mimeMessage);
            await client.DisconnectAsync(true);
            _logger.LogInformation("Email sent successfully to {To}", string.Join(", ", mimeMessage.To));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {To}", string.Join(", ", mimeMessage.To));
            throw;
        }
    }
}