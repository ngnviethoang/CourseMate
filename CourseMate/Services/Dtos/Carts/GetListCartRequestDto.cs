namespace CourseMate.Services.Dtos.Carts;

public class GetListCartRequestDto
{
    [MaxLength(1024)]
    public string? Sorting { get; set; }

    [Range(0, int.MaxValue)]
    public int? SkipCount { get; set; }

    [Range(0, 1000)]
    public int? MaxResultCount { get; set; }

    public Guid? StudentId { get; set; }
}