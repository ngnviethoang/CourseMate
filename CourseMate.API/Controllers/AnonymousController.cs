using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseMate.API.Controllers;

[ApiController]
[Route("api/anonymous")]
[AllowAnonymous]
public class AnonymousController : ControllerBase
{
    private IMediator _mediator;

    public AnonymousController(IMediator mediator)
    {
        _mediator = mediator;
    }
}