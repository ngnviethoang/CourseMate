using System.ComponentModel.DataAnnotations;
using Volo.Abp.Domain.Entities.Auditing;

namespace CourseMate.Entities.Categories;

public class Category : FullAuditedEntity<Guid>
{
    public Category(Guid id, string name, string description) : base(id)
    {
        Name = name;
        Description = description;
    }

    [MaxLength(1024)]
    public string Name { get; set; }

    [MaxLength(32768)] // 2^15
    public string Description { get; set; }
}