namespace CourseMate.Contracts.DTOs;

public class DashboardDto
{
    public decimal TotalRevenue { get; set; }
    public int TotalStudents { get; set; }
    public int TotalCourses { get; set; }
    public int TotalOrders { get; set; }

    public List<MonthlyRevenueDto> RevenueByMonth { get; set; } = [];
    public List<TopCourseDto> TopCourses { get; set; } = [];
    public List<TopInstructorDto> TopInstructors { get; set; } = [];
}