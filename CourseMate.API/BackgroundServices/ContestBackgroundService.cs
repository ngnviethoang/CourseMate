using CourseMate.Application.Commands.Contests;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.API.BackgroundServices;

public class ContestBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<ContestBackgroundService> _logger;

    public ContestBackgroundService(IServiceProvider serviceProvider, ILogger<ContestBackgroundService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessExpiredContestsAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while processing expired contests.");
            }

            // Check every minute
            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }

    private async Task ProcessExpiredContestsAsync(CancellationToken cancellationToken)
    {
        using IServiceScope scope = _serviceProvider.CreateScope();
        CourseMateDbContext dbContext = scope.ServiceProvider.GetRequiredService<CourseMateDbContext>();
        IMediator mediator = scope.ServiceProvider.GetRequiredService<IMediator>();

        List<Guid> expiredContestIds = await dbContext.Contests
            .Where(c => c.Status == ContestStatus.Ongoing && c.EndTime.HasValue && c.EndTime.Value <= DateTimeOffset.UtcNow)
            .Select(c => c.Id)
            .ToListAsync(cancellationToken);

        foreach (Guid contestId in expiredContestIds)
        {
            try
            {
                _logger.LogInformation("Automatically ending expired contest: {ContestId}", contestId);
                await mediator.Send(new EndContestCommand { ContestId = contestId, IsSystemTrigger = true }, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to automatically end contest: {ContestId}", contestId);
            }
        }
    }
}
