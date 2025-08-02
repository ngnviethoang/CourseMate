using CourseMate.Entities.Orders;
using CourseMate.Permissions;
using CourseMate.Services.Dtos.Courses;
using CourseMate.Services.Dtos.Orders;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Domain.Repositories;

namespace CourseMate.Services.Orders;

[Authorize(CourseMatePermissions.Orders.Default)]
public class OrderAppService : CourseMateAppService, IOrderAppService
{
    public async Task<OrderDto> GetAsync(Guid id)
    {
        IQueryable<OrderDto> orderQueryable =
            from order in await OrderRepo.GetQueryableAsync()
            select new OrderDto
            {
                Id = order.Id,
                StudentId = order.StudentId,
                Currency = order.Currency,
                TotalAmount = order.TotalAmount,
                Description = order.Description,
                CreationTime = order.CreationTime,
                CreatorId = order.CreatorId,
                LastModificationTime = order.LastModificationTime,
                LastModifierId = order.LastModifierId
            };

        IQueryable<OrderItemDto> orderItemQueryable =
            from orderItem in await OrderItemRepo.GetQueryableAsync()
            join course in await CourseRepo.GetQueryableAsync()
                on orderItem.CourseId equals course.Id
            where orderItem.OrderId == id
            select new OrderItemDto
            {
                Id = orderItem.Id,
                CourseId = orderItem.CourseId,
                OrderId = orderItem.OrderId,
                Price = orderItem.Price,
                Course = new CourseDto
                {
                    Id = course.Id,
                    Title = course.Title,
                    Description = course.Description,
                    ThumbnailFile = course.ThumbnailFile,
                    Price = course.Price,
                    Currency = course.Currency,
                    LevelType = course.LevelType,
                    IsPublished = course.IsPublished,
                    InstructorId = course.InstructorId,
                    CategoryId = course.CategoryId,
                    Slug = course.Slug,
                    CreationTime = course.CreationTime,
                    CreatorId = course.CreatorId,
                    LastModificationTime = course.LastModificationTime,
                    LastModifierId = course.LastModifierId
                }
            };

        OrderDto? orderDto = await AsyncExecuter.FirstOrDefaultAsync(orderQueryable);
        if (orderDto == null)
        {
            return new OrderDto();
        }

        orderDto.Items = await AsyncExecuter.ToListAsync(orderItemQueryable);
        return orderDto;
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