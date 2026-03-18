using CourseMate.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Infrastructure.DbConfigurations;

public class LessonCodingConfigurations : IEntityTypeConfiguration<LessonCoding>
{
    public void Configure(EntityTypeBuilder<LessonCoding> builder)
    {
        builder.ToTable("LessonCodings");
        builder.Property(i => i.ProblemStatement).HasColumnType("citext").IsRequired();
        builder.Property(i => i.StarterCode).HasColumnType("citext").IsRequired();
        builder.Property(i => i.ExpectedOutput).HasColumnType("citext").IsRequired();
        builder.HasOne<Lesson>().WithOne().HasForeignKey<LessonCoding>(i => i.LessonId);
    }
}