using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Contracts.DTOs.Instructors;
using CourseMate.Contracts.Enums;
using CourseMate.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Instructors;

internal sealed class GetInstructorDashboardDataQueryHandler : AbstractQueryHandler<GetInstructorDashboardDataQuery, DashboardDto>
{
    public GetInstructorDashboardDataQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<DashboardDto> Handle(GetInstructorDashboardDataQuery request, CancellationToken cancellationToken)
    {
        Guid instructorId = GetCurrentUserId();

        // 1. Basic Stats for this instructor
        var instructorCourseIds = await DbContext.Courses
            .Where(c => c.InstructorId == instructorId)
            .Select(c => c.Id)
            .ToListAsync(cancellationToken);

        decimal totalRevenue = await (
            from orderItem in DbContext.OrderItems
            join order in DbContext.Orders on orderItem.OrderId equals order.Id
            where instructorCourseIds.Contains(orderItem.CourseId) && order.Status == OrderStatus.Paid
            select orderItem.Price
        ).SumAsync(cancellationToken);

        int totalStudents = await (
            from orderItem in DbContext.OrderItems
            join order in DbContext.Orders on orderItem.OrderId equals order.Id
            where instructorCourseIds.Contains(orderItem.CourseId) && order.Status == OrderStatus.Paid
            select order.StudentId
        ).Distinct().CountAsync(cancellationToken);

        int totalCourses = instructorCourseIds.Count;
        
        int totalOrders = await (
            from orderItem in DbContext.OrderItems
            join order in DbContext.Orders on orderItem.OrderId equals order.Id
            where instructorCourseIds.Contains(orderItem.CourseId) && order.Status == OrderStatus.Paid
            select order.Id
        ).Distinct().CountAsync(cancellationToken);

        // 2. Revenue By Month (Last 12 Months)
        DateTimeOffset twelveMonthsAgo = DateTimeOffset.UtcNow.AddMonths(-11);
        twelveMonthsAgo = new DateTimeOffset(twelveMonthsAgo.Year, twelveMonthsAgo.Month, 1, 0, 0, 0, twelveMonthsAgo.Offset);

        var monthlyRevenueData = await (
            from orderItem in DbContext.OrderItems
            join order in DbContext.Orders on orderItem.OrderId equals order.Id
            where instructorCourseIds.Contains(orderItem.CourseId) && order.Status == OrderStatus.Paid && order.CreationTime >= twelveMonthsAgo
            select new { orderItem.Price, order.CreationTime }
        ).ToListAsync(cancellationToken);

        var revenueByMonth = monthlyRevenueData
            .GroupBy(o => new { o.CreationTime.Month, o.CreationTime.Year })
            .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
            .Select(g => new MonthlyRevenueDto
            {
                Month = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM yyyy"),
                Revenue = g.Sum(o => o.Price)
            })
            .ToList();

        // 3. Top 5 Courses for this instructor
        var topCourses = await (
            from orderItem in DbContext.OrderItems
            join order in DbContext.Orders on orderItem.OrderId equals order.Id
            join course in DbContext.Courses on orderItem.CourseId equals course.Id
            where course.InstructorId == instructorId && order.Status == OrderStatus.Paid
            group new { orderItem, course } by new { course.Id, course.Title } into g
            orderby g.Sum(x => x.orderItem.Price) descending
            select new TopCourseDto
            {
                Id = g.Key.Id,
                Title = g.Key.Title,
                EnrollmentCount = g.Count(),
                Revenue = g.Sum(x => x.orderItem.Price)
            }
        ).Take(5).ToListAsync(cancellationToken);

        return new DashboardDto
        {
            TotalRevenue = totalRevenue,
            TotalStudents = totalStudents,
            TotalCourses = totalCourses,
            TotalOrders = totalOrders,
            RevenueByMonth = revenueByMonth,
            TopCourses = topCourses,
            TopInstructors = [] // Instructors don't see a ranking of other instructors in their personal dashboard
        };
    }
}
