namespace CourseMate.Contracts.DTOs;

public class CategoryDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public bool IsActive { get; set; }

    public int CourseCount { get; set; }

    public DateTimeOffset CreationTime { get; set; }

    public DateTimeOffset? LastModificationTime { get; set; }
}