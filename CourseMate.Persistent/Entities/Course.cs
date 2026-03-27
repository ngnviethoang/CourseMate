using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class Course : Entity
{
    public Course(Guid id, string title, string description, decimal price, string imageUrl, bool isPublished, Guid categoryId, Guid instructorId) : base(id)
    {
        Title = title;
        Description = description;
        Price = price;
        ImageUrl = imageUrl;
        IsPublished = isPublished;
        CategoryId = categoryId;
        InstructorId = instructorId;
    }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Title { get; set; }

    [MaxLength(CourseMateConsts.DescriptionMaxLength)]
    public string Description { get; set; }

    public decimal Price { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string ImageUrl { get; set; }

    public bool IsPublished { get; set; }

    public Guid CategoryId { get; set; }

    public Guid InstructorId { get; set; }
}