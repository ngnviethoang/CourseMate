namespace CourseMate.Contracts.DTOs.Admins;

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

public class MonthlyRevenueDto
{
    public string Month { get; set; } = string.Empty; // e.g., "Jan 2024"
    public decimal Revenue { get; set; }
}

public class TopCourseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int EnrollmentCount { get; set; }
    public decimal Revenue { get; set; }
}

public class TopInstructorDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int CourseCount { get; set; }
    public decimal TotalRevenue { get; set; }
}
