using CourseMate.Services.Dtos.VnPay;
using CourseMate.Services.VnPay;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;

namespace CourseMate.Controllers;

[ApiController]
[Route("api/v1/payments")]
public class PaymentController : AbpController
{
    private readonly IVnPayService _vnPayService;

    public PaymentController(IVnPayService vnPayService)
    {
        _vnPayService = vnPayService;
    }

    [HttpGet("vnpay/{orderId:guid}")]
    public async Task<IActionResult> GetVnPayment([FromRoute] Guid orderId)
    {
        string ipAddress = Utils.GetIpAddress(HttpContext);
        string paymentRequestUrl = await _vnPayService.CreatePaymentUrl(orderId, ipAddress);
        return Redirect(paymentRequestUrl);
    }

    [HttpGet("vnpay-return")]
    public async Task<IActionResult> VnPayReturnUrlCallback([FromQuery] ReturnUrlRequestDto input)
    {
        VnPayResponseDto result = await _vnPayService.ReturnUrlVnPay(input);

        // Gợi ý: Chuyển hướng đến trang kết quả thanh toán
        string redirectUrl = $"/checkout/result?orderCode={input.vnp_TxnRef}&status={result.RspCode}";
        return Redirect(redirectUrl);
    }

    [HttpGet("ipn")]
    public async Task<IActionResult> VnPayIpnUrlCallback([FromQuery] ReturnUrlRequestDto input)
    {
        VnPayResponseDto result = await _vnPayService.InstantPaymentNotification(input);

        return Content(result.RspCode == nameof(VnPayResponseCode.Success) ? "OK" : "FAIL");
    }
}