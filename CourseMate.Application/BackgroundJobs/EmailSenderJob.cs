using CourseMate.Contracts.Options;
using Hangfire;
using MailKit.Net.Smtp;
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
    public async Task Execute(string toEmail, string subject, string htmlBody)
    {
        if (string.IsNullOrWhiteSpace(toEmail))
        {
            throw new ArgumentException("Email recipient is required.", nameof(toEmail));
        }

        string fromAddress = string.IsNullOrWhiteSpace(_smtpOptions.DefaultFromAddress)
            ? _smtpOptions.UserName
            : _smtpOptions.DefaultFromAddress;

        MimeMessage mimeMessage = new();
        mimeMessage.From.Add(MailboxAddress.Parse(fromAddress));
        mimeMessage.To.Add(MailboxAddress.Parse(toEmail));
        mimeMessage.Subject = string.IsNullOrWhiteSpace(subject) ? "(No Subject)" : subject;
        mimeMessage.Body = new BodyBuilder
        {
            HtmlBody = htmlBody
        }.ToMessageBody();

        _logger.LogInformation(
            "Sending email. To={To}, SubjectLength={SubjectLength}, Host={Host}, Port={Port}",
            toEmail,
            mimeMessage.Subject.Length,
            _smtpOptions.Host,
            _smtpOptions.Port);
        try
        {
            using SmtpClient client = new();
            await client.ConnectAsync(_smtpOptions.Host, _smtpOptions.Port);
            await client.AuthenticateAsync(_smtpOptions.UserName, _smtpOptions.Password);
            await client.SendAsync(mimeMessage);
            await client.DisconnectAsync(true);
            _logger.LogInformation("Email sent successfully to {To}", toEmail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {To}", toEmail);
            throw;
        }
    }
}