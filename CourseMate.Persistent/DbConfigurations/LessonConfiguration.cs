using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class LessonConfiguration : IEntityTypeConfiguration<Lesson>
{
    public void Configure(EntityTypeBuilder<Lesson> builder)
    {
        builder.ToTable("Lessons");
        builder.Property(i => i.Title).HasColumnType("citext");
        builder.HasOne<Chapter>().WithMany().HasForeignKey(i => i.ChapterId);
        builder.HasOne<Course>().WithMany().HasForeignKey(i => i.CourseId);
    }
}