using CourseMate.Entities.Reviews;

namespace CourseMate.Services.Dtos.Reviews;

public class CreateUpdateReviewDto
{
    public Guid StudentId { get; set; }
    public Guid CourseId { get; set; }
    public RatingType Rating { get; set; }

    [MaxLength(1024)]
    public string Comment { get; set; } = string.Empty;
}