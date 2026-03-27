namespace CourseMate.Contracts.DTOs.Commons;

public class MonthlyRevenueDto
{
    public string Month { get; set; } = string.Empty; // e.g., "Jan 2024"
    public decimal Revenue { get; set; }
}