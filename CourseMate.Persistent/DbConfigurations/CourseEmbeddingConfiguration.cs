using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class CourseEmbeddingConfiguration : IEntityTypeConfiguration<CourseEmbedding>
{
    public void Configure(EntityTypeBuilder<CourseEmbedding> builder)
    {
        builder.ToTable("CourseEmbeddings");
        builder.HasOne<Course>().WithMany().HasForeignKey(i => i.CourseId);
        builder.Property(i => i.Embedding).HasColumnType("vector(768)");
        builder.HasIndex(i => i.CourseId).IsUnique();
    }
}