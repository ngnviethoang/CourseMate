using System.ComponentModel.DataAnnotations;

namespace Crawler.Models.Categories;

public class Category
{
    public Guid Id { get; set; }

    [MaxLength(1024)]
    public string Name { get; set; }

    [MaxLength(1024)]
    public string Description { get; set; }
}