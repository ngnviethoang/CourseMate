using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Dashboards;

public class GetDashboardDataQuery : IRequest<DashboardDto>;

internal sealed class GetDashboardDataQueryHandler : AbstractQueryHandler<GetDashboardDataQuery, DashboardDto>
{
    public GetDashboardDataQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<DashboardDto> Handle(GetDashboardDataQuery request, CancellationToken ct)
    {
        decimal totalRevenue = await DbContext.Orders
            .Where(o => o.Status == OrderStatus.Completed)
            .SumAsync(o => o.TotalAmount, ct);

        int totalStudents = await DbContext.Users.CountAsync(ct);
        int totalCourses = await DbContext.Courses.CountAsync(ct);
        int totalOrders = await DbContext.Orders.CountAsync(ct);

        DateTimeOffset twelveMonthsAgo = DateTimeOffset.UtcNow.AddMonths(-11);
        twelveMonthsAgo = new DateTimeOffset(twelveMonthsAgo.Year, twelveMonthsAgo.Month, 1, 0, 0, 0, twelveMonthsAgo.Offset);

        List<MonthlyOrderDto> monthlyOrders = await DbContext.Orders
            .Where(o => o.Status == OrderStatus.Completed && o.CreationTime >= twelveMonthsAgo)
            .Select(o => new MonthlyOrderDto(o.TotalAmount, o.CreationTime))
            .ToListAsync(ct);

        List<MonthlyRevenueDto> revenueByMonth = monthlyOrders
            .GroupBy(o => new { o.CreationTime.Month, o.CreationTime.Year })
            .OrderBy(g => g.Key.Year)
            .ThenBy(g => g.Key.Month)
            .Select(g => new MonthlyRevenueDto
            {
                Month = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM yyyy"),
                Revenue = g.Sum(o => o.TotalAmount)
            })
            .ToList();

        List<TopCourseDto> topCourses = await (
            from orderItem in DbContext.OrderItems
            join order in DbContext.Orders on orderItem.OrderId equals order.Id
            join course in DbContext.Courses on orderItem.CourseId equals course.Id
            where order.Status == OrderStatus.Completed
            group new { orderItem, course } by new { course.Id, course.Title }
            into g
            orderby g.Sum(x => x.orderItem.Price) descending
            select new TopCourseDto
            {
                Id = g.Key.Id,
                Title = g.Key.Title,
                EnrollmentCount = g.Count(),
                Revenue = g.Sum(x => x.orderItem.Price)
            }
        ).Take(5).ToListAsync(ct);

        List<TopInstructorDto> topInstructors = await (
            from orderItem in DbContext.OrderItems
            join order in DbContext.Orders on orderItem.OrderId equals order.Id
            join course in DbContext.Courses on orderItem.CourseId equals course.Id
            join instructor in DbContext.Users on course.InstructorId equals instructor.Id
            where order.Status == OrderStatus.Completed
            group new { orderItem, instructor } by new { instructor.Id, instructor.UserName }
            into g
            orderby g.Sum(x => x.orderItem.Price) descending
            select new TopInstructorDto
            {
                Id = g.Key.Id,
                Name = g.Key.UserName ?? "Unknown",
                CourseCount = DbContext.Courses.Count(c => c.InstructorId == g.Key.Id),
                TotalRevenue = g.Sum(x => x.orderItem.Price)
            }
        ).Take(5).ToListAsync(ct);

        return new DashboardDto
        {
            TotalRevenue = totalRevenue,
            TotalStudents = totalStudents,
            TotalCourses = totalCourses,
            TotalOrders = totalOrders,
            RevenueByMonth = revenueByMonth,
            TopCourses = topCourses,
            TopInstructors = topInstructors
        };
    }

    private sealed record MonthlyOrderDto(decimal TotalAmount, DateTimeOffset CreationTime);
}
