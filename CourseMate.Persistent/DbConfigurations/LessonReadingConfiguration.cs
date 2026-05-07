using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class LessonReadingConfiguration : IEntityTypeConfiguration<LessonReading>
{
    public void Configure(EntityTypeBuilder<LessonReading> builder)
    {
        builder.ToTable("LessonReadings");
        builder.Property(i => i.Content).HasColumnType("citext");
        builder.HasOne<Lesson>().WithOne().HasForeignKey<LessonReading>(i => i.LessonId);
    }
}