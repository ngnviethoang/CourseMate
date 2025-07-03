using System.ComponentModel.DataAnnotations;
using Volo.Abp.Domain.Entities.Auditing;

namespace CourseMate.Entities.Reviews;

public class Review : FullAuditedEntity<Guid>
{
    public Review(Guid id, Guid studentId, Guid courseId, RatingType rating, string comment) : base(id)
    {
        StudentId = studentId;
        CourseId = courseId;
        Rating = rating;
        Comment = comment;
    }

    public Guid StudentId { get; set; }
    public Guid CourseId { get; set; }
    public RatingType Rating { get; set; }

    [MaxLength(1024)]
    public string Comment { get; set; }
}