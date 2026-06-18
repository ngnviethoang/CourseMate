using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class CourseSimilarity : Entity
{
    public CourseSimilarity(Guid id, Guid courseId, Guid similarCourseId, double score) : base(id)
    {
        CourseId = courseId;
        SimilarCourseId = similarCourseId;
        Score = score;
    }

    public Guid CourseId { get; set; }

    public Guid SimilarCourseId { get; set; }

    public double Score { get; set; }
}
