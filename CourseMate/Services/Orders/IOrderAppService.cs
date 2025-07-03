using CourseMate.Services.Dtos.Orders;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace CourseMate.Services.Orders;

public interface IOrderAppService : ICrudAppService<OrderDto, Guid, PagedAndSortedResultRequestDto, CreateUpdateOrderDto>;