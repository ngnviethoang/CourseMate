namespace CourseMate.Contracts.DTOs.Instructors;

public class OutlineSectionDto
{
    public int Order { get; set; }
    public string Title { get; set; } = string.Empty;
    public List<string> Bullets { get; set; } = [];
}