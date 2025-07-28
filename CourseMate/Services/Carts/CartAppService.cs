using CourseMate.Entities.Carts;
using CourseMate.Permissions;
using CourseMate.Services.Dtos.Carts;
using CourseMate.Services.Dtos.Courses;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Domain.Repositories;

namespace CourseMate.Services.Carts;

[Authorize(CourseMatePermissions.Enrollments.Default)]
public class CartAppService : CourseMateAppService, ICartAppService
{
    public async Task<PagedResultDto<CartDto>> GetListAsync(GetListCartRequestDto input)
    {
        IQueryable<CartDto> queryable =
            from cart in await CartRepo.GetQueryableAsync()
            join course in await CourseRepo.GetQueryableAsync()
                on cart.CourseId equals course.Id
            join user in await UserRepo.GetQueryableAsync()
                on course.InstructorId equals user.Id
            select new CartDto
            {
                Id = cart.Id,
                CreationTime = cart.CreationTime,
                CreatorId = cart.CreatorId,
                LastModificationTime = cart.LastModificationTime,
                LastModifierId = cart.LastModifierId,
                CourseId = course.Id,
                StudentId = cart.UserId,
                Course = new CourseDto
                {
                    Id = course.Id,
                    Title = course.Title,
                    Description = string.Empty,
                    ThumbnailFile = course.ThumbnailFile,
                    Price = course.Price,
                    Currency = course.Currency,
                    LevelType = course.LevelType,
                    IsPublished = course.IsPublished,
                    InstructorId = course.InstructorId,
                    CategoryId = course.CategoryId,
                    CreationTime = course.CreationTime,
                    CreatorId = course.CreatorId,
                    LastModificationTime = course.LastModificationTime,
                    LastModifierId = course.LastModifierId,
                    Author = new AuthorDto
                    {
                        UserName = user.UserName,
                        Avatar = user.Email
                    }
                },
            };
        queryable = queryable.WhereIf(input.StudentId.HasValue, e => e.StudentId == input.StudentId);
        queryable = queryable.OrderBy(input.Sorting.IsNullOrWhiteSpace() ? nameof(CartDto.CreationTime) : input.Sorting);

        if (input.SkipCount.HasValue)
        {
            queryable = queryable.Skip(input.SkipCount.Value);
        }

        if (input.MaxResultCount.HasValue)
        {
            queryable = queryable.Take(input.MaxResultCount.Value);
        }

        List<CartDto> carts = await AsyncExecuter.ToListAsync(queryable);
        int totalCount = await CartRepo.CountAsync();
        return new PagedResultDto<CartDto>(totalCount, carts);
    }

    [Authorize(CourseMatePermissions.Enrollments.Create)]
    public async Task<ResultObjectDto> CreateAsync(CreateCartDto input)
    {
        Guid userId = CurrentUser.Id.GetValueOrDefault();
        await UserRepo.EnsureExistsAsync(userId);
        await CourseRepo.EnsureExistsAsync(input.CourseId);
        Cart? cart = await CartRepo.FirstOrDefaultAsync(i => i.UserId == userId && i.CourseId == input.CourseId);
        if (cart is null)
        {
            cart = new Cart(GuidGenerator.Create(), userId, input.CourseId);
            await CartRepo.InsertAsync(cart);
        }

        return new ResultObjectDto(cart.Id);
    }

    [Authorize(CourseMatePermissions.Enrollments.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        await CartRepo.DeleteAsync(id);
    }
}