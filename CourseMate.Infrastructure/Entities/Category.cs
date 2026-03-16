using CourseMate.Contract;
using CourseMate.Core.Entities.Abstracts;
using System.ComponentModel.DataAnnotations;

namespace CourseMate.Core.Entities;

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