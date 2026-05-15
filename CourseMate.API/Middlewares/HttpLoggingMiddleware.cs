using Microsoft.Extensions.Primitives;

namespace CourseMate.API.Middlewares;

public class HttpLoggingMiddleware : IMiddleware
{
    /// <summary>
    ///     Client can pass 'x-request-id' on the header to the API service.
    ///     If this is not given, API service will randomly generate one at the beginning of the API call.
    /// </summary>
    private const string RequestIdKey = "x-request-id";

    private readonly ILogger<HttpLoggingMiddleware> _logger;

    public HttpLoggingMiddleware(ILogger<HttpLoggingMiddleware> logger)
    {
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        string requestId = context.Request.Headers.TryGetValue(RequestIdKey, out StringValues value) ? value.ToString() : Guid.NewGuid().ToString();
        Dictionary<string, string> scope = new()
        {
            [RequestIdKey] = requestId
        };
        context.Items[RequestIdKey] = requestId;
        context.Response.Headers[RequestIdKey] = requestId;
        using (_logger.BeginScope(scope))
        {
            try
            {
                _logger.LogInformation("HTTP Request {method} {path}", context.Request.Method, context.Request.Path);
                await next(context);
            }
            finally
            {
                _logger.LogInformation("HTTP Response {method} {path} => {statusCode}", context.Request.Method, context.Request.Path, context.Response.StatusCode);
            }
        }
    }
}