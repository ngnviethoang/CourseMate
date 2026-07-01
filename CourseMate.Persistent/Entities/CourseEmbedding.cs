using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Persistent.Entities.Abstracts;
using Pgvector;

namespace CourseMate.Persistent.Entities;

/// <summary>
/// Cached Gemini embedding for a course (Title + Description + Categories).
/// Generated lazily when a course is first needed for similarity search so we never have to
/// recompute the vector on every recommendation call.
/// </summary>
public class CourseEmbedding : Entity
{
    public CourseEmbedding(Guid id, Guid courseId, string sourceText, int dimensions, Vector embedding) : base(id)
    {
        CourseId = courseId;
        SourceText = sourceText;
        Dimensions = dimensions;
        Embedding = embedding;
    }

    public Guid CourseId { get; set; }

    [MaxLength(CourseMateConsts.ContentMaxLength)]
    public string SourceText { get; set; }

    /// <summary>Embedding dimensions (defaults to 768 to match Gemini embedding-001).</summary>
    public int Dimensions { get; set; }

    public Vector Embedding { get; set; }
}
