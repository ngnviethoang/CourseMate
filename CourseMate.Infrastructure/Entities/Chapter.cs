using System.ComponentModel.DataAnnotations;
using CourseMate.Contract;
using CourseMate.Core.Entities.Abstracts;

namespace CourseMate.Core.Entities;

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