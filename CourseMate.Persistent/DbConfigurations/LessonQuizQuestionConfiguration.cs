using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class LessonQuizQuestionConfiguration : IEntityTypeConfiguration<LessonQuizQuestion>
{
    public void Configure(EntityTypeBuilder<LessonQuizQuestion> builder)
    {
        builder.ToTable("LessonQuizQuestions");
        builder.HasOne<LessonQuiz>().WithMany().HasForeignKey(x => x.LessonQuizId);
    }
}