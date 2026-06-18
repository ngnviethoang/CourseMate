using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class CourseCoOccurrence : Entity
{
    public CourseCoOccurrence(Guid id, Guid courseId, Guid coCourseId, double weight, int coCount) : base(id)
    {
        CourseId = courseId;
        CoCourseId = coCourseId;
        Weight = weight;
        CoCount = coCount;
    }

    public Guid CourseId { get; set; }

    public Guid CoCourseId { get; set; }

    public double Weight { get; set; }

    public int CoCount { get; set; }
}
