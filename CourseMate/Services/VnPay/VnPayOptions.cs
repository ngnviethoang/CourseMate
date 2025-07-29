namespace CourseMate.Services.VnPay;

public class VnPayOptions
{
    public string VnpTmnCode { get; set; } = string.Empty;
    public string VnpHashSecret { get; set; } = string.Empty;
    public string VnpReturnUrl { get; set; } = string.Empty;
    public string VnpUrl { get; set; } = string.Empty;
}