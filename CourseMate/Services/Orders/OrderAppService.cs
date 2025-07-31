using CourseMate.Entities.Orders;
using CourseMate.Permissions;
using CourseMate.Services.Dtos.Orders;
using Microsoft.AspNetCore.Authorization;
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
        Guid userId = CurrentUser.Id.GetValueOrDefault();
        await UserRepo.EnsureExistsAsync(userId);
        foreach (Guid courseId in input.CourseIds)
        {
            await CourseRepo.EnsureExistsAsync(courseId);
        }

        var courseQuery =
            from course in await CourseRepo.GetQueryableAsync()
            where input.CourseIds.Contains(course.Id)
            select new { course.Id, course.Price };
        Guid orderId = GuidGenerator.Create();
        var courses = await AsyncExecuter.ToListAsync(courseQuery);
        IEnumerable<OrderItem> orderItems = courses.Select(i => new OrderItem(GuidGenerator.Create(), orderId, i.Id, i.Price));
        Order order = new(orderId, userId, 0, "VND", OrderStatusType.Draft, string.Empty);

        await OrderRepo.InsertAsync(order);
        await OrderItemRepo.InsertManyAsync(orderItems);
        return new ResultObjectDto(order.Id);
    }
}