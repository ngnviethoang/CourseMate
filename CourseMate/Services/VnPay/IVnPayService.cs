using CourseMate.Services.Dtos.VnPay;

namespace CourseMate.Services.VnPay;

public interface IVnPayService : IApplicationService
{
    Task<string> CreatePaymentUrl(Guid orderId, string clientIp);
    VnPayResponseDto ReturnUrlVnPay(ReturnUrlRequestDto input);
    Task<VnPayResponseDto> InstantPaymentNotification(ReturnUrlRequestDto input);
}