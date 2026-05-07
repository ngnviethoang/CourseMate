using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class LessonVideoConfiguration : IEntityTypeConfiguration<LessonVideo>
{
    public void Configure(EntityTypeBuilder<LessonVideo> builder)
    {
        builder.ToTable("LessonVideos");
        builder.HasOne<Lesson>().WithOne().HasForeignKey<LessonVideo>(i => i.LessonId);
    }
}