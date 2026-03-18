using CourseMate.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Infrastructure.DbConfigurations;

public class LessonQuizConfigurations : IEntityTypeConfiguration<LessonQuiz>
{
    public void Configure(EntityTypeBuilder<LessonQuiz> builder)
    {
        builder.ToTable("LessonQuizzes");
        builder.Property(i => i.Description).HasColumnType("citext").IsRequired();
        builder.HasOne<Lesson>().WithOne().HasForeignKey<LessonQuiz>(i => i.LessonId);
    }
}