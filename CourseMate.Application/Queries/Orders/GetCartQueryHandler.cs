using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Orders;

public class GetCartQuery : IRequest<CartDto?>
{
    public Guid StudentId { get; set; }
}

internal sealed class GetCartQueryHandler : AbstractQueryHandler<GetCartQuery, CartDto?>
{
    public GetCartQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<CartDto?> Handle(GetCartQuery request, CancellationToken cancellationToken)
    {
        Guid studentId = IsInRole(Roles.Admin) ? request.StudentId : CurrentUserId;

        Cart? cart = await DbContext.Carts.FirstOrDefaultAsync(c => c.StudentId == studentId, cancellationToken);
        if (cart == null)
        {
            return new CartDto { StudentId = studentId };
        }

        List<CartItemDto> items = await (
            from item in DbContext.CartItems
            join course in DbContext.Courses on item.CourseId equals course.Id
            join instructor in DbContext.Users on course.InstructorId equals instructor.Id
            where item.CartId == cart.Id
            select new CartItemDto
            {
                Id = item.Id,
                CourseId = course.Id,
                CourseTitle = course.Title,
                CourseImageUrl = course.ImageUrl,
                InstructorName = instructor.UserName ?? string.Empty,
                Price = course.Price
            }).ToListAsync(cancellationToken);

        return new CartDto
        {
            Id = cart.Id,
            StudentId = cart.StudentId,
            Items = items,
            TotalPrice = items.Sum(x => x.Price)
        };
    }
}