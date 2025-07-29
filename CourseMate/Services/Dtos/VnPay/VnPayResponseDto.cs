using CourseMate.Services.VnPay;
using CourseMate.Shared;

namespace CourseMate.Services.Dtos.VnPay;

public class VnPayResponseDto(VnPayResponseCode code)
{
    public string RspCode { get; private set; } = code.ToString();
    public string Message { get; private set; } = code.DescriptionAttr();
}