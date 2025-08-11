namespace CourseMate.Entities.Categories;

public class Category : FullAuditedEntity<Guid>
{
    public Category(Guid id, string name, string description, bool isActive) : base(id)
    {
        Name = name;
        Description = description;
        IsActive = isActive;
    }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Name { get; set; }

    [MaxLength(CourseMateConst.DescriptionMaxLength)]
    public string Description { get; set; }

    public bool IsActive { get; set; }
}