using CourseMate.Application.Commands.Payments;
using CourseMate.Contracts.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseMate.API.Controllers;

[ApiController]
[Route("api/payments")]
[Authorize]
public class PaymentController : ControllerBase
{
    private readonly IMediator _mediator;

    public PaymentController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("create-url")]
    public async Task<IActionResult> CreatePayOsPayment(CreatePaymentUrlCommand request)
    {
        CreatePaymentUrlResponse result = await _mediator.Send(request);
        return Ok(result);
    }

    [AllowAnonymous]
    [HttpPost("payos-ipn")]
    public async Task<IActionResult> PayOsIpnUrlCallback(IpnUrlCallbackCommand request)
    {
        int result = await _mediator.Send(request);
        return Ok(result);
    }

    [AllowAnonymous]
    [HttpPost("fake-payos-ipn")]
    public async Task<IActionResult> PayOsIpnUrlCallback(FakeIpnUrlCallbackCommand request)
    {
        int result = await _mediator.Send(request);
        return Ok(result);
    }
}