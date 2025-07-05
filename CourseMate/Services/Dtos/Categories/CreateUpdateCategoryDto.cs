using System.ComponentModel.DataAnnotations;

namespace CourseMate.Services.Dtos.Categories;

public class CreateUpdateCategoryDto
{
    [MaxLength(1024)]
    [Required]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1024)]
    public string Description { get; set; } = string.Empty;
}