namespace CourseMate.Services.Dtos.Orders;

public class CreateUpdateOrderDto
{
    public IEnumerable<Guid> CourseIds { get; set; } = [];
}