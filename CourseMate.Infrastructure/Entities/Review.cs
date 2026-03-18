using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Infrastructure.Entities.Abstracts;

namespace CourseMate.Infrastructure.Entities;

public class Review : Entity
{
    public Review(Guid id, Guid courseId, Guid studentId, int rating, string comment) : base(id)
    {
        CourseId = courseId;
        StudentId = studentId;
        Rating = rating;
        Comment = comment;
    }

    public Guid CourseId { get; set; }

    public Guid StudentId { get; set; }

    public int Rating { get; set; }

    [MaxLength(CourseMateConsts.ContentMaxLength)]
    public string Comment { get; set; }
}