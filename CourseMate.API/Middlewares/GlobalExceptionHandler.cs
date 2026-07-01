using System.Net;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace CourseMate.API.Middlewares;

public sealed class GlobalExceptionHandler : IExceptionHandler
{
    private readonly IWebHostEnvironment _env;
    private readonly IProblemDetailsService _problemDetailsService;

    public GlobalExceptionHandler(IProblemDetailsService problemDetailsService, IWebHostEnvironment env)
    {
        _problemDetailsService = problemDetailsService;
        _env = env;
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken ct)
    {
        ProblemDetails problemDetails = new()
        {
            Status = httpContext.Response.StatusCode,
            Instance = null,
            Title = "Internal Server Error",
            Type = "https://datatracker.ietf.org/doc/html/rfc7231#section-6.6.1",
            Detail = _env.IsProduction() ? "Internal Server Error" : exception.Message,
            Extensions =
            {
                ["traceId"] = httpContext.TraceIdentifier,
                ["timestamp"] = DateTimeOffset.UtcNow
            }
        };

        switch (exception)
        {
            case EntityNotFoundException:
                httpContext.Response.StatusCode = (int)HttpStatusCode.NotFound;
                problemDetails.Status = httpContext.Response.StatusCode;
                problemDetails.Title = "Not Found";
                problemDetails.Detail = "Entity Not Found";
                problemDetails.Type = "https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.4";
                problemDetails.Extensions["errorCode"] = ErrorCode.EntityNotFound.ToString();
                problemDetails.Extensions["errorCodeValue"] = (int)ErrorCode.EntityNotFound;
                break;
            case BusinessException businessException:
                httpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                problemDetails.Status = httpContext.Response.StatusCode;
                problemDetails.Title = "Bad Request";
                problemDetails.Detail = string.IsNullOrWhiteSpace(businessException.Message)
                    ? "Business error."
                    : businessException.Message;
                problemDetails.Type = "https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.1";
                problemDetails.Extensions["errorCode"] = businessException.ErrorCode.ToString();
                problemDetails.Extensions["errorCodeValue"] = (int)businessException.ErrorCode;
                break;
            case UnauthorizedAccessException:
                httpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                problemDetails.Status = httpContext.Response.StatusCode;
                problemDetails.Title = "Unauthorized";
                problemDetails.Detail = exception.Message;
                problemDetails.Type = "https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.1";
                break;
            case BadHttpRequestException:
                httpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                problemDetails.Status = httpContext.Response.StatusCode;
                problemDetails.Title = "BadRequest";
                problemDetails.Detail = exception.Message;
                problemDetails.Type = "https://datatracker.ietf.org/doc/html/rfc7231#section-6.6.1";
                break;
        }

        return await _problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            ProblemDetails = problemDetails
        });
    }
}