using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class LessonQuizQuestionConfiguration : IEntityTypeConfiguration<LessonQuizQuestion>
{
    public void Configure(EntityTypeBuilder<LessonQuizQuestion> builder)
    {
        builder.HasKey(x => x.Id);
        builder.HasOne(x => x.Quiz)
               .WithMany(x => x.Questions)
               .HasForeignKey(x => x.QuizId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
