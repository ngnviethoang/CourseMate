using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Enums;

namespace CourseMate.Contracts.DTOs.Admins;

public class GetListOrdersQuery : GetListQuery<AdminOrderDto>
{
    public OrderStatus? Status { get; set; }
}