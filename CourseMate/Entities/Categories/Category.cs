namespace CourseMate.Entities.Categories;

public class Category : FullAuditedEntity<Guid>
{
    public Category(Guid id, string name, string description) : base(id)
    {
        Name = name;
        Description = description;
    }

    [MaxLength(CourseMateConst.DefaultMaxLength)]
    public string Name { get; set; }

    [MaxLength(CourseMateConst.DescriptionMaxLength)]
    public string Description { get; set; }
}