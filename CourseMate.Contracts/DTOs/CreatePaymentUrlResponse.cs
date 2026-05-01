namespace CourseMate.Contracts.DTOs;

public class CreatePaymentUrlResponse
{
    public string CheckoutUrl { get; set; } = string.Empty;
    public Guid PaymentTransactionId { get; set; }
}