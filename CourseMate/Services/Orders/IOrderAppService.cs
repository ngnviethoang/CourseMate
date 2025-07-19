using CourseMate.Services.Dtos.Orders;

namespace CourseMate.Services.Orders;

public interface IOrderAppService : IApplicationService
{
    Task<OrderDto> GetAsync(Guid id);
    Task<PagedResultDto<OrderDto>> GetListAsync(GetListRequestDto input);
    Task<ResultObjectDto> CreateAsync(CreateUpdateOrderDto input);
    Task<OrderDto> UpdateAsync(Guid id, CreateUpdateOrderDto input);
    Task DeleteAsync(Guid id);
}