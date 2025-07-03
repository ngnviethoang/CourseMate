using System.Linq.Dynamic.Core;
using CourseMate.Entities.Orders;
using CourseMate.Permissions;
using CourseMate.Services.Dtos.Orders;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;

namespace CourseMate.Services.Orders;

[Authorize(CourseMatePermissions.Orders.Default)]
public class OrderAppService : CourseMateAppService, IOrderAppService
{
    public async Task<OrderDto> GetAsync(Guid id)
    {
        var order = await OrderRepo.GetAsync(id);
        return ObjectMapper.Map<Order, OrderDto>(order);
    }

    public async Task<PagedResultDto<OrderDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        var queryable = await OrderRepo.GetQueryableAsync();
        var query = queryable
            .OrderBy(input.Sorting.IsNullOrWhiteSpace() ? "Name" : input.Sorting)
            .Skip(input.SkipCount)
            .Take(input.MaxResultCount);

        var orders = await AsyncExecuter.ToListAsync(query);
        int totalCount = await AsyncExecuter.CountAsync(queryable);

        return new PagedResultDto<OrderDto>(totalCount, ObjectMapper.Map<List<Order>, List<OrderDto>>(orders)
        );
    }

    [Authorize(CourseMatePermissions.Orders.Create)]
    public async Task<OrderDto> CreateAsync(CreateUpdateOrderDto input)
    {
        Order order = ObjectMapper.Map<CreateUpdateOrderDto, Order>(input);
        await OrderRepo.InsertAsync(order);
        return ObjectMapper.Map<Order, OrderDto>(order);
    }

    [Authorize(CourseMatePermissions.Orders.Edit)]
    public async Task<OrderDto> UpdateAsync(Guid id, CreateUpdateOrderDto input)
    {
        var order = await OrderRepo.GetAsync(id);
        ObjectMapper.Map(input, order);
        await OrderRepo.UpdateAsync(order);
        return ObjectMapper.Map<Order, OrderDto>(order);
    }

    [Authorize(CourseMatePermissions.Orders.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        await OrderRepo.DeleteAsync(id);
    }
}