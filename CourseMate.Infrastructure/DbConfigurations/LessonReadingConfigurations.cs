using CourseMate.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Infrastructure.DbConfigurations;

public class LessonReadingConfigurations : IEntityTypeConfiguration<LessonReading>
{
    public void Configure(EntityTypeBuilder<LessonReading> builder)
    {
        builder.ToTable("LessonReadings");
        builder.Property(i => i.Content).HasColumnType("citext").IsRequired();
        builder.HasOne<Lesson>().WithOne().HasForeignKey<LessonReading>(i => i.LessonId);
    }
}