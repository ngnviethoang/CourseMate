using CourseMate.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Core.DbConfigurations;

public class ChapterConfigurations : IEntityTypeConfiguration<Chapter>
{
    public void Configure(EntityTypeBuilder<Chapter> builder)
    {
        builder.ToTable("Chapters");
        builder.Property(i => i.Title).HasColumnType("citext").IsRequired();
        builder.HasOne<Course>().WithMany().HasForeignKey(i => i.CourseId);
    }
}