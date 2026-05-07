using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class LessonQuizAnswerConfiguration : IEntityTypeConfiguration<LessonQuizAnswer>
{
    public void Configure(EntityTypeBuilder<LessonQuizAnswer> builder)
    {
        builder.ToTable("LessonQuizAnswers");
        builder.HasOne<LessonQuizQuestion>().WithMany().HasForeignKey(x => x.LessonQuizQuestionId);
    }
}