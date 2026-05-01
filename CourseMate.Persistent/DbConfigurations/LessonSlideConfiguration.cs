using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class LessonSlideConfiguration : IEntityTypeConfiguration<LessonSlide>
{
    public void Configure(EntityTypeBuilder<LessonSlide> builder)
    {
        builder.ToTable("LessonSlides");
        builder.Property(i => i.FileUrl).HasColumnType("citext").IsRequired();
        builder.HasOne<Lesson>().WithOne().HasForeignKey<LessonSlide>(i => i.LessonId);
    }
}
