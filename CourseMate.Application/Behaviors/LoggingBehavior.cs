using System.Diagnostics;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization.Metadata;
using CourseMate.Contracts.Attributes;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CourseMate.Application.Behaviors;

public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : IRequest<TResponse>
{
    private const string MaskedValue = "***";
    private const int SlowRequestThresholdMs = 5000;

    private static readonly JsonSerializerOptions JsonSerializerOptions = new()
    {
        TypeInfoResolver = new SensitiveDataMaskingResolver()
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

    protected virtual string FilterSensitiveInformationOnRequest(TRequest request)
    {
        return JsonSerializer.Serialize(request, JsonSerializerOptions);
    }

    protected virtual string FilterSensitiveInformationOnResponse(TResponse response)
    {
        return JsonSerializer.Serialize(response, JsonSerializerOptions);
    }

    private sealed class SensitiveDataMaskingResolver : DefaultJsonTypeInfoResolver
    {
        public SensitiveDataMaskingResolver()
        {
            Modifiers.Add(MaskSensitiveStringProperties);
        }

        private static void MaskSensitiveStringProperties(JsonTypeInfo jsonTypeInfo)
        {
            if (jsonTypeInfo.Kind != JsonTypeInfoKind.Object)
            {
                return;
            }

            foreach (JsonPropertyInfo property in jsonTypeInfo.Properties)
            {
                if (property.PropertyType != typeof(string))
                {
                    continue;
                }

                if (property.AttributeProvider is not PropertyInfo propertyInfo)
                {
                    continue;
                }

                if (propertyInfo.GetCustomAttribute<SensitiveDataAttribute>() == null)
                {
                    continue;
                }

                property.Get = _ => MaskedValue;
            }
        }
    }
}