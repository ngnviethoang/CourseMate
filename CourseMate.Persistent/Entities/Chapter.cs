using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class Chapter : Entity
{
    public Chapter(Guid id, Guid courseId, string title, string position) : base(id)
    {
        CourseId = courseId;
        Title = title;
        Position = position;
    }

    public Guid CourseId { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Title { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Position { get; set; }
}