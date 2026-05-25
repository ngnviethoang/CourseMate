using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

internal sealed class UserLessonProgressConfiguration : IEntityTypeConfiguration<UserLessonProgress>
{
    public void Configure(EntityTypeBuilder<UserLessonProgress> builder)
    {
        builder.ToTable("UserLessonProgresses");
        builder.HasOne<User>().WithMany().HasForeignKey(x => x.StudentId);
        builder.HasOne<Lesson>().WithMany().HasForeignKey(x => x.LessonId);
    }
}