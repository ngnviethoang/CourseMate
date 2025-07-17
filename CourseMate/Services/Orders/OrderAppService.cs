using CourseMate.Entities.Orders;
using CourseMate.Permissions;
using CourseMate.Services.Dtos;
using CourseMate.Services.Dtos.Orders;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Domain.Repositories;

namespace CourseMate.Services.Orders;

[Authorize(CourseMatePermissions.Orders.Default)]
public class OrderAppService : CourseMateAppService, IOrderAppService
{
    public async Task<OrderDto> GetAsync(Guid id)
    {
        Order order = await OrderRepo.GetAsync(id);
        return ObjectMapper.Map<Order, OrderDto>(order);
    }

    public async Task<PagedResultDto<OrderDto>> GetListAsync(GetListRequestDto input)
    {
        IQueryable<OrderDto> queryable =
            from order in await OrderRepo.GetQueryableAsync()
            select new OrderDto();

        if (input.SkipCount.HasValue)
        {
            queryable = queryable.Skip(input.SkipCount.Value);
        }

        if (input.MaxResultCount.HasValue)
        {
            queryable = queryable.Take(input.MaxResultCount.Value);
        }

        List<OrderDto> orders = await AsyncExecuter.ToListAsync(queryable);
        int totalCount = await AsyncExecuter.CountAsync(queryable);

        return new PagedResultDto<OrderDto>(totalCount, orders);
    }

    [Authorize(CourseMatePermissions.Orders.Create)]
    public async Task<ResultObjectDto> CreateAsync(CreateUpdateOrderDto input)
    {
        await UserRepo.EnsureExistsAsync(input.StudentId);
        await PaymentRequestRepo.EnsureExistsAsync(input.PaymentRequestId);
        foreach (CreateUpdateOrderItemDto item in input.Items)
        {
            await CourseRepo.EnsureExistsAsync(item.CourseId);
        }

        Order order = ObjectMapper.Map<CreateUpdateOrderDto, Order>(input);
        List<OrderItem> orderItems = ObjectMapper.Map<List<CreateUpdateOrderItemDto>, List<OrderItem>>(input.Items);
        await OrderRepo.InsertAsync(order);
        await OrderItemRepo.InsertManyAsync(orderItems);
        return new ResultObjectDto(order.Id);
    }

    [Authorize(CourseMatePermissions.Orders.Edit)]
    public async Task<OrderDto> UpdateAsync(Guid id, CreateUpdateOrderDto input)
    {
        Order order = await OrderRepo.GetAsync(id);
        await UserRepo.EnsureExistsAsync(input.StudentId);
        await PaymentRequestRepo.EnsureExistsAsync(input.PaymentRequestId);
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