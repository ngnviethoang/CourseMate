using System.Net;
using CourseMate.Contract.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace CourseMate.API.Middlewares;

public sealed class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;
    private readonly IProblemDetailsService _problemDetailsService;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger, IProblemDetailsService problemDetailsService)
    {
        _logger = logger;
        _problemDetailsService = problemDetailsService;
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        ProblemDetails problemDetails = new()
        {
            Status = httpContext.Response.StatusCode,
            Instance = null,
            Title = "Internal Server Error",
            Type = "https://datatracker.ietf.org/doc/html/rfc7231#section-6.6.1",
            Detail = exception.Message,
            Extensions =
            {
                ["traceId"] = httpContext.TraceIdentifier,
                ["timestamp"] = DateTimeOffset.UtcNow
            }
        };

        switch (exception)
        {
            case BusinessException businessException:
                httpContext.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                problemDetails.Status = httpContext.Response.StatusCode;
                problemDetails.Title = "Forbidden";
                problemDetails.Detail = businessException.Message;
                problemDetails.Type = "https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.3";
                break;
        }

        return await _problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            ProblemDetails = problemDetails
        });
    }
}