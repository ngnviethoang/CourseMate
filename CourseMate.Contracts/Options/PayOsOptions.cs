namespace CourseMate.Contracts.Options;

public class PayOsOptions
{
    public string ClientId { get; set; } = string.Empty;
    public string SecretKey { get; set; } = string.Empty;
    public string ChecksumKey { get; set; } = string.Empty;
    public string PartnerCode { get; set; } = string.Empty;
    public string ReturnUrl { get; set; } = string.Empty;
    public string CancelUrl { get; set; } = string.Empty;
}