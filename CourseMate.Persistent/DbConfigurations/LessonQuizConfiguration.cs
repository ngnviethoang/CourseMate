using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class LessonQuizConfiguration : IEntityTypeConfiguration<LessonQuiz>
{
    public void Configure(EntityTypeBuilder<LessonQuiz> builder)
    {
        builder.ToTable("LessonQuizzes");
        builder.Property(i => i.Description).HasColumnType("citext").IsRequired();
        builder.HasOne<Lesson>().WithOne().HasForeignKey<LessonQuiz>(i => i.LessonId);
    }
}