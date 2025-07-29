namespace CourseMate.Services.Dtos.VnPay;

public class ReturnUrlRequestDto
{
    [Range(8, 8)]
    public string vnp_TmnCode { get; set; }

    [Range(1, 12)]
    public int vnp_Amount { get; set; }

    [Range(3, 20)]
    public string vnp_BankCode { get; set; }

    [Range(1, 255)]
    public string vnp_BankTranNo { get; set; }

    [Range(2, 20)]
    public string vnp_CardType { get; set; }

    [Range(14, 14)]
    public int vnp_PayDate { get; set; }

    [Range(1, 255)]
    public string vnp_OrderInfo { get; set; }

    [Range(1, 15)]
    public int vnp_TransactionNo { get; set; }

    [Range(2, 2)]
    public int vnp_ResponseCode { get; set; }

    [Range(2, 2)]
    public int vnp_TransactionStatus { get; set; }

    [Range(1, 100)]
    public string vnp_TxnRef { get; set; }

    [Range(1, 10)]
    public string vnp_SecureHashType { get; set; }

    [Range(32, 256)]
    public string vnp_SecureHash { get; set; }
}