using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class CourseSimilarityConfiguration : IEntityTypeConfiguration<CourseSimilarity>
{
    public void Configure(EntityTypeBuilder<CourseSimilarity> builder)
    {
        builder.ToTable("CourseSimilarities");
        builder.HasOne<Course>().WithMany().HasForeignKey(i => i.CourseId);
        builder.HasOne<Course>().WithMany().HasForeignKey(i => i.SimilarCourseId);
        builder.HasIndex(i => new { i.CourseId, i.Score });
    }
}