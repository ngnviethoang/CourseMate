using CourseMate.Persistent.Entities.Abstracts;
using Pgvector;

namespace CourseMate.Persistent.Entities;

public class CourseEmbedding : Entity
{
    public CourseEmbedding(Guid id, Guid courseId, Vector embedding) : base(id)
    {
        CourseId = courseId;
        Embedding = embedding;
    }

    public Guid CourseId { get; set; }

    public Vector Embedding { get; set; }
}