using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Infrastructure.Entities.Abstracts;

namespace CourseMate.Infrastructure.Entities;

public class Chapter : Entity
{
    public Chapter(Guid id, Guid courseId, string title, int position) : base(id)
    {
        CourseId = courseId;
        Title = title;
        Position = position;
    }

    public Guid CourseId { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Title { get; set; }

    public int Position { get; set; }
}