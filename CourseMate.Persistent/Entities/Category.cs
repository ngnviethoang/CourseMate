using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class Category : Entity
{
    public Category(Guid id, string name, string description, bool isActive) : base(id)
    {
        Name = name;
        Description = description;
        IsActive = isActive;
    }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Name { get; set; }

    [MaxLength(CourseMateConsts.DescriptionMaxLength)]
    public string Description { get; set; }

    public bool IsActive { get; set; }
}