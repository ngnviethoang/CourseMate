using System.Diagnostics;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CourseMate.Application.Behaviors;

public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : IRequest<TResponse>
{
    private const int SlowRequestThresholdMs = 5000;
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct)
    {
        string requestName = typeof(TRequest).Name;
        _logger.LogInformation("Handling {@RequestName} {@Request}", requestName, request);
        Stopwatch stopwatch = Stopwatch.StartNew();
        TResponse response = await next(ct);
        stopwatch.Stop();
        long elapsedMs = stopwatch.ElapsedMilliseconds;
        if (elapsedMs > SlowRequestThresholdMs)
        {
            _logger.LogWarning("Long running request {RequestName} took {ElapsedMilliseconds} ms", requestName, elapsedMs);
        }
        else
        {
            _logger.LogInformation("Handled {RequestName} in {ElapsedMilliseconds}ms", requestName, stopwatch.ElapsedMilliseconds);
        }

        return response;
    }
}