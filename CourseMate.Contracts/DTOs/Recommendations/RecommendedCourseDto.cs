using CourseMate.Contracts.Enums;

namespace CourseMate.Contracts.DTOs.Recommendations;

public class RecommendedCourseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public double Score { get; set; }
    public RecommendationReason Reason { get; set; }
}