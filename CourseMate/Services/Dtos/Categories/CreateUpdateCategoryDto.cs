namespace CourseMate.Services.Dtos.Categories;

public class CreateUpdateCategoryDto
{
    [MaxLength(1024)]
    [Required]
    public string Name { get; set; } = string.Empty;

    [MaxLength(32768)] // 2^15
    public string Description { get; set; } = string.Empty;
}