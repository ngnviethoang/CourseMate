using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Shared;

public abstract class AbstractRequestHandler
{
    protected readonly IHttpContextAccessor HttpContextAccessor;

    protected AbstractRequestHandler(IHttpContextAccessor httpContextAccessor)
    {
        HttpContextAccessor = httpContextAccessor;
    }

    protected Guid CurrentUserId
    {
        get
        {
            string? userIdString = HttpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
            Guid.TryParse(userIdString, out Guid userId);
            return userId;
        }
    }

    protected bool IsAuthenticated()
    {
        return HttpContextAccessor.HttpContext?.User.Identity?.IsAuthenticated ?? false;
    }

    protected bool IsInRole(string role)
    {
        return HttpContextAccessor.HttpContext?.User.IsInRole(role) ?? false;
    }
}