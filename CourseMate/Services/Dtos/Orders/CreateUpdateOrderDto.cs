using CourseMate.Services.Dtos.PaymentRequests;

namespace CourseMate.Services.Dtos.Orders;

public class CreateUpdateOrderDto
{
    public IEnumerable<Guid> CourseIds { get; set; } = [];
    public PaymentRequestDto PaymentRequest { get; set; }
}