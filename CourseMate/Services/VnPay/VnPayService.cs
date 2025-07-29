using System.Reflection;
using CourseMate.Entities.Orders;
using CourseMate.Services.Dtos.VnPay;
using CourseMate.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Volo.Abp;

namespace CourseMate.Services.VnPay;

[Authorize]
[RemoteService(false)]
public class VnPayService : CourseMateAppService, IVnPayService
{
    private readonly VnPayOptions _vnPayOptions;

    public VnPayService(IOptions<VnPayOptions> vnPayConfig)
    {
        _vnPayOptions = vnPayConfig.Value;
    }

    public async Task<string> CreatePaymentUrl(Guid orderId, string clientIp)
    {
        Order? order = await OrderRepo.FindAsync(i => i.Id == orderId && i.Status == OrderStatusType.Submitted);

        if (order is null)
        {
            Logger.LogWarning("Invalid order with ID: {OrderId}", orderId);
            throw new UserFriendlyException($"Invalid order with ID: {orderId}");
        }

        CreateVnPayUrlRequestDto req = new()
        {
            vnp_Version = "2.1.0",
            vnp_Amount = Convert.ToInt32(order.TotalAmount).ToString(),
            vnp_BankCode = "",
            vnp_Command = "pay",
            vnp_CreateDate = Helper.ConvertToDateIntString(DateTime.UtcNow.AddHours(7)),
            vnp_CurrCode = "VND",
            vnp_ExpireDate = Helper.ConvertToDateIntString(DateTime.UtcNow.AddHours(7).AddMinutes(15)),
            vnp_IpAddr = clientIp,
            vnp_Locale = "vn",
            vnp_OrderInfo = Helper.RemoveUnicode(order.Description),
            vnp_OrderType = "100000",
            vnp_ReturnUrl = _vnPayOptions.VnpReturnUrl,
            vnp_TmnCode = _vnPayOptions.VnpTmnCode,
            vnp_TxnRef = order.Id.ToString()
        };

        VnPayLibrary vnPayLibrary = new();
        foreach (PropertyInfo property in req.GetType().GetProperties())
        {
            string? value = property.GetValue(req) as string;
            vnPayLibrary.AddRequestData(property.Name, value);
        }

        string paymentUrl = vnPayLibrary.CreateRequestUrl(_vnPayOptions.VnpUrl, _vnPayOptions.VnpHashSecret);
        Logger.LogInformation("Payment URL created for Order ID: {OrderId}, URL: {PaymentUrl}", orderId, paymentUrl);
        return paymentUrl;
    }

    public async Task<VnPayResponseDto> ReturnUrlVnPay(ReturnUrlRequestDto input)
    {
        VnPayLibrary vnpay = new();
        bool isValid = vnpay.ValidateSignature(input.vnp_SecureHash, _vnPayOptions.VnpHashSecret);
        if (!isValid)
        {
            Logger.LogWarning("Invalid signature, InputData={ReturnUrlRequestDto}", input);
            return new VnPayResponseDto(VnPayResponseCode.InvalidSignature);
        }

        Guid.TryParse(input.vnp_TxnRef, out Guid orderId);
        Enum.TryParse(input.vnp_ResponseCode.ToString(), out VnPayResponseCode responseCode);
        Enum.TryParse(input.vnp_TransactionStatus.ToString(), out VnPayResponseCode transactionStatus);

        if (responseCode == VnPayResponseCode.Success && transactionStatus == VnPayResponseCode.Success)
        {
            Logger.LogInformation("Thanh toan thanh cong, OrderId={0}, VNPAY TranId={1}", orderId, input.vnp_TransactionNo);
            return new VnPayResponseDto(responseCode);
        }

        Logger.LogInformation("Thanh toan loi, OrderId={0}, VNPAY TranId={1},ResponseCode={2}", orderId, input.vnp_TransactionNo, input.vnp_ResponseCode);
        return new VnPayResponseDto(responseCode);
    }

    public async Task<VnPayResponseDto> InstantPaymentNotification(ReturnUrlRequestDto input)
    {
        VnPayLibrary vnpay = new();
        bool isValid = vnpay.ValidateSignature(input.vnp_SecureHash, _vnPayOptions.VnpHashSecret);
        if (!isValid)
        {
            Logger.LogWarning("Invalid signature, InputData={ReturnUrlRequestDto}", input);
            return new VnPayResponseDto(VnPayResponseCode.InvalidSignature);
        }

        Guid.TryParse(input.vnp_TxnRef, out Guid orderId);
        Order? order = await OrderRepo.FindAsync(i => i.Id == orderId);
        Enum.TryParse(input.vnp_ResponseCode.ToString(), out VnPayResponseCode responseCode);
        Enum.TryParse(input.vnp_TransactionStatus.ToString(), out VnPayResponseCode transactionStatus);

        if (order is null)
        {
            Logger.LogWarning("Order not found for TxnRef: {InputVnpTxnRef}", input.vnp_TxnRef);
            return new VnPayResponseDto(VnPayResponseCode.OtherErrors);
        }

        if (Convert.ToInt32(order.TotalAmount) == input.vnp_Amount)
        {
            return new VnPayResponseDto(VnPayResponseCode.PartialRefundOnly);
        }

        if (order.Status == OrderStatusType.AwaitingValidation)
        {
            return new VnPayResponseDto(VnPayResponseCode.TransactionNotFound);
        }

        if (order.Status == OrderStatusType.Submitted && responseCode == VnPayResponseCode.Success && transactionStatus == VnPayResponseCode.Success)
        {
            Logger.LogInformation("Payment successful  for Order ID: {OrderId}", order.Id);
            order.Status = OrderStatusType.Paid;
            return new VnPayResponseDto(VnPayResponseCode.Success);
        }

        Logger.LogInformation("Payment failed for Order ID: {OrderId}", order.Id);
        return new VnPayResponseDto(VnPayResponseCode.OtherErrors);
    }
}