using System.Linq.Dynamic.Core;
using CourseMate.Entities.Orders;
using CourseMate.Permissions;
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

    public async Task<PagedResultDto<OrderDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        IQueryable<Order> queryable = await OrderRepo.GetQueryableAsync();
        IQueryable<Order> query = queryable
            .OrderBy(input.Sorting.IsNullOrWhiteSpace() ? "Name" : input.Sorting)
            .Skip(input.SkipCount)
            .Take(input.MaxResultCount);

        List<Order> orders = await AsyncExecuter.ToListAsync(query);
        int totalCount = await AsyncExecuter.CountAsync(queryable);

        return new PagedResultDto<OrderDto>(totalCount, ObjectMapper.Map<List<Order>, List<OrderDto>>(orders));
    }

    [Authorize(CourseMatePermissions.Orders.Create)]
    public async Task<OrderDto> CreateAsync(CreateUpdateOrderDto input)
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
        return ObjectMapper.Map<Order, OrderDto>(order);
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