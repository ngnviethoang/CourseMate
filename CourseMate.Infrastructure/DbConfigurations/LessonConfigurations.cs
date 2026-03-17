using CourseMate.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Core.DbConfigurations;

public class LessonConfigurations : IEntityTypeConfiguration<Lesson>
{
    public void Configure(EntityTypeBuilder<Lesson> builder)
    {
        builder.ToTable("Lessons");
        builder.Property(i => i.Title).HasColumnType("citext").IsRequired();
        builder.HasOne<Chapter>().WithMany().HasForeignKey(i => i.ChapterId);
        builder.HasOne<Course>().WithMany().HasForeignKey(i => i.CourseId);
    }
}