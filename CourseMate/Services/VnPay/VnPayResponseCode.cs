using System.ComponentModel;

namespace CourseMate.Services.VnPay;

public enum VnPayResponseCode
{
    [Description("Giao dịch thành công")]
    Success = 00,

    [Description("Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).")]
    SuspiciousTransaction = 07,

    [Description(
        "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.")]
    InternetBankingNotRegistered = 09,

    [Description("Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần")]
    AuthenticationFailed = 10,

    [Description(
        "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.")]
    PaymentTimeout = 11,

    [Description("Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.")]
    AccountLocked = 12,

    [Description(
        "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.")]
    OTPIncorrect = 13,

    [Description("Giao dịch không thành công do: Khách hàng hủy giao dịch")]
    TransactionCancelled = 24,

    [Description("Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.")]
    InsufficientBalance = 51,

    [Description("Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.")]
    ExceededDailyLimit = 65,

    [Description("Ngân hàng thanh toán đang bảo trì.")]
    BankMaintenance = 75,

    [Description(
        "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch.")]
    PaymentPasswordIncorrect = 79,

    [Description("Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)")]
    OtherErrors = 99,

    // Tra cứu giao dịch (vnp_Command=querydr)
    [Description("Merchant không hợp lệ (kiểm tra lại vnp_TmnCode)")]
    InvalidMerchant = 02,

    [Description("Dữ liệu gửi sang không đúng định dạng")]
    InvalidFormat = 03,

    [Description("Không tìm thấy giao dịch yêu cầu")]
    TransactionNotFound = 91,

    [Description("Yêu cầu bị trùng lặp trong thời gian giới hạn của API (Giới hạn trong 5 phút)")]
    DuplicateRequest = 94,

    [Description("Chữ ký không hợp lệ")]
    InvalidSignature = 97,

    // Gửi yêu cầu hoàn trả (vnp_Command=refund)
    [Description("Tổng số tiền hoản trả lớn hơn số tiền gốc")]
    RefundAmountExceedsOriginal = 02,

    [Description("Không cho phép hoàn trả toàn phần sau khi hoàn trả một phần")]
    PartialRefundOnly = 04,

    [Description("Chỉ cho phép hoàn trả một phần")]
    PartialRefundAllowed = 13,

    [Description("Số tiền hoàn trả không hợp lệ. Số tiền hoàn trả phải nhỏ hơn hoặc bằng số tiền thanh toán.")]
    InvalidRefundAmount = 93,

    [Description("Yêu cầu bị trùng lặp trong thời gian giới hạn của API (Giới hạn trong 5 phút)")]
    RefundDuplicateRequest = 94,

    [Description("Giao dịch này không thành công bên VNPAY. VNPAY từ chối xử lý yêu cầu.")]
    VnpayRejected = 95,

    [Description("Timeout Exception")]
    TimeoutException = 98
}