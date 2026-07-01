using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class CourseEmbeddingConfiguration : IEntityTypeConfiguration<CourseEmbedding>
{
    public void Configure(EntityTypeBuilder<CourseEmbedding> builder)
    {
        builder.ToTable("CourseEmbeddings");
        builder.HasIndex(x => x.CourseId).IsUnique();
        builder.HasOne<Course>().WithMany().HasForeignKey(x => x.CourseId).OnDelete(DeleteBehavior.Cascade);
        builder.Property(x => x.Embedding).HasColumnType($"vector(768)").IsRequired();
    }
}
