namespace CourseMate.Contracts.DTOs.Students;

public class StudentMyCourseDto : CourseDto
{
    public double ProgressPercentage { get; set; }

    public int TotalLessons { get; set; }

    public int CompletedLessons { get; set; }

    public string? LastLessonTitle { get; set; }
}
