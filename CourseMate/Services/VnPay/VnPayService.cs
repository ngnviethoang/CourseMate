using System.Reflection;
using System.Transactions;
using CourseMate.Entities.Orders;
using CourseMate.Entities.PaymentRequests;
using CourseMate.Permissions;
using CourseMate.Services.Dtos.VnPay;
using CourseMate.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Volo.Abp;

namespace CourseMate.Services.VnPay;

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
        PaymentRequest paymentRequest = new(GuidGenerator.Create(), PaymentStatusType.Pending, "VND", "VNPAY", string.Empty, orderId, string.Empty);
        await PaymentRequestRepo.InsertAsync(paymentRequest);
        return paymentUrl;
    }

    public VnPayResponseDto ReturnUrlVnPay(ReturnUrlRequestDto input)
    {
        Guid.TryParse(input.vnp_TxnRef, out Guid orderId);
        Enum.TryParse(input.vnp_TxnRef, out VnPayResponseCode vnPayResponseCode);
        Enum.TryParse(input.vnp_TxnRef, out TransactionStatus vnpTransactionStatus);

        VnPayLibrary vnpay = new();
        bool checkSignature = vnpay.ValidateSignature(input.vnp_SecureHash, _vnPayOptions.VnpHashSecret);
        if (!checkSignature)
        {
            Logger.LogWarning("Invalid signature, InputData={ReturnUrlRequestDto}", input);
            return new VnPayResponseDto(VnPayResponseCode.InvalidSignature);
        }

        if (vnPayResponseCode == VnPayResponseCode.Success && vnpTransactionStatus == TransactionStatus.Active)
        {
            Logger.LogInformation("Thanh toan thanh cong, OrderId={0}, VNPAY TranId={1}", orderId, input.vnp_TransactionNo);
            return new VnPayResponseDto(vnPayResponseCode);
        }

        Logger.LogWarning("Thanh toan loi, OrderId={0}, VNPAY TranId={1},ResponseCode={2}", orderId, input.vnp_TransactionNo, input.vnp_ResponseCode);
        return new VnPayResponseDto(vnPayResponseCode);
    }

    public async Task<VnPayResponseDto> InstantPaymentNotification(ReturnUrlRequestDto input)
    {
        Guid.TryParse(input.vnp_TxnRef, out Guid orderId);
        Enum.TryParse(input.vnp_TxnRef, out VnPayResponseCode vnPayResponseCode);
        Enum.TryParse(input.vnp_TxnRef, out TransactionStatus vnpTransactionStatus);
        long vnpAmount = Convert.ToInt64(input.vnp_Amount) / 100;
        long vnpTransactionId = Convert.ToInt64(input.vnp_TransactionNo);

        VnPayLibrary vnpay = new();
        bool checkSignature = vnpay.ValidateSignature(input.vnp_SecureHash, _vnPayOptions.VnpHashSecret);
        if (!checkSignature)
        {
            Logger.LogWarning("Invalid signature, InputData={ReturnUrlRequestDto}", input);
            return new VnPayResponseDto(VnPayResponseCode.InvalidSignature);
        }

        Order? order = await OrderRepo.FindAsync(i => i.Id == orderId);

        if (order is null)
        {
            Logger.LogWarning("Order not found for TxnRef: {InputVnpTxnRef}", input.vnp_TxnRef);
            return new VnPayResponseDto(VnPayResponseCode.TransactionNotFound);
        }

        PaymentRequest? paymentRequest = await PaymentRequestRepo.FindAsync(x => x.OrderId == orderId);
        if (paymentRequest is null)
        {
            Logger.LogWarning("PaymentRequest not found for TxnRef: {InputVnpTxnRef}", input.vnp_TxnRef);
            return new VnPayResponseDto(VnPayResponseCode.TransactionNotFound);
        }

        if (order.TotalAmount != vnpAmount)
        {
            return new VnPayResponseDto(VnPayResponseCode.PartialRefundOnly);
        }

        if (order.Status != OrderStatusType.Submitted)
        {
            return new VnPayResponseDto(VnPayResponseCode.InvalidMerchant);
        }

        if (vnPayResponseCode == VnPayResponseCode.Success &&
            vnpTransactionStatus == TransactionStatus.Active)
        {
            Logger.LogInformation("Thanh toan thanh cong, OrderId={0}, VNPAY TranId={1}", orderId, vnpTransactionId);
            order.Status = OrderStatusType.Paid;
            await OrderRepo.UpdateAsync(order);
            return new VnPayResponseDto(VnPayResponseCode.Success);
        }

        Logger.LogWarning("Thanh toan loi, OrderId={0}, VNPAY TranId={1},ResponseCode={2}", orderId, vnpTransactionId, vnPayResponseCode);
        order.Status = OrderStatusType.Cancelled;
        await OrderRepo.UpdateAsync(order);
        return new VnPayResponseDto(VnPayResponseCode.Success);
    }
}