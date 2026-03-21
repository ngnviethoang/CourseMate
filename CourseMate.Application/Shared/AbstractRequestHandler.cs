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

    protected Guid GetCurrentUserId()
    {
        string? userIdString = HttpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(userIdString, out Guid parsedId) ? parsedId : Guid.Empty;
    }
}