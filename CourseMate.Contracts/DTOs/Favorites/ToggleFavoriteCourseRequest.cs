namespace CourseMate.Contracts.DTOs;

public class ToggleFavoriteCourseRequest
{
    public Guid CourseId { get; set; }
    public bool IsFavorite { get; set; }
}
