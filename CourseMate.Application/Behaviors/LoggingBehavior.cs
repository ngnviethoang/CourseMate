using System.Diagnostics;
using CourseMate.Contracts.Json;
using MediatR;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace CourseMate.Application.Behaviors;

public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : IRequest<TResponse>
{
    private const int SlowRequestThresholdMs = 5000;

    private static readonly JsonSerializerSettings _jsonSerializerSettings = new()
    {
        ContractResolver = new SensitiveDataMaskingContractResolver("***")
    };

    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct)
    {
        string requestName = typeof(TRequest).Name;
        string sanitizedRequest = FilterSensitiveInformationOnRequest(request);
        _logger.LogInformation("Handling {RequestName} {Request}", requestName, sanitizedRequest);
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
            _logger.LogInformation("Handled {RequestName} in {ElapsedMilliseconds}ms", requestName, elapsedMs);
        }

        return response;
    }

    private static string FilterSensitiveInformationOnRequest(TRequest request)
    {
        return JsonConvert.SerializeObject(request, _jsonSerializerSettings);
    }

    private string FilterSensitiveInformationOnResponse(TResponse response)
    {
        return JsonConvert.SerializeObject(response, _jsonSerializerSettings);
    }
}