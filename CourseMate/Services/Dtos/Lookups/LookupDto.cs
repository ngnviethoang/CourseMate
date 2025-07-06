namespace CourseMate.Services.Dtos.Lookups;

public class LookupDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid? CreatorId { get; set; }
}