using System.Security.Claims;
using CourseMate.Contracts.DTOs.Students;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Students;

internal sealed class GetCartQueryHandler : IRequestHandler<GetCartQuery, CartDto?>
{
    private readonly CourseMateReadOnlyDbContext _dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetCartQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
    {
        _dbContext = dbContext;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<CartDto?> Handle(GetCartQuery request, CancellationToken cancellationToken)
    {
        string? userIdString = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid studentId = Guid.TryParse(userIdString, out Guid parsedId) ? parsedId : Guid.Empty;

        Cart? cart = await _dbContext.Carts
            .FirstOrDefaultAsync(c => c.StudentId == studentId, cancellationToken);

        if (cart == null)
        {
            return new CartDto { StudentId = studentId };
        }

        List<CartItemDto> items = await (from item in _dbContext.CartItems
            join course in _dbContext.Courses on item.CourseId equals course.Id
            join instructor in _dbContext.Users on course.InstructorId equals instructor.Id
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