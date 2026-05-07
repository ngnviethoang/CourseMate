using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class LessonCodingConfiguration : IEntityTypeConfiguration<LessonCoding>
{
    public void Configure(EntityTypeBuilder<LessonCoding> builder)
    {
        builder.ToTable("LessonCodings");
        builder.HasOne<Lesson>().WithOne().HasForeignKey<LessonCoding>(i => i.LessonId);
        builder.HasOne<Exercise>().WithMany().HasForeignKey(i => i.ExerciseId);
    }
}