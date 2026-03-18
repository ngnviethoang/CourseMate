using CourseMate.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Infrastructure.DbConfigurations;

public class LessonVideoConfigurations : IEntityTypeConfiguration<LessonVideo>
{
    public void Configure(EntityTypeBuilder<LessonVideo> builder)
    {
        builder.ToTable("LessonVideos");
        builder.Property(i => i.VideoUrl).HasColumnType("citext").IsRequired();
        builder.HasOne<Lesson>().WithOne().HasForeignKey<LessonVideo>(i => i.LessonId);
    }
}