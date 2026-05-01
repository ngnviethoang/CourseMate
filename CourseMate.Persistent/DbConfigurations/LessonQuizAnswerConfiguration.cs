using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class LessonQuizAnswerConfiguration : IEntityTypeConfiguration<LessonQuizAnswer>
{
    public void Configure(EntityTypeBuilder<LessonQuizAnswer> builder)
    {
        builder.HasKey(x => x.Id);
        builder.HasOne(x => x.Question)
            .WithMany(x => x.Answers)
            .HasForeignKey(x => x.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}