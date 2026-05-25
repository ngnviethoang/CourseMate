using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

internal sealed class ContestSubmissionConfiguration : IEntityTypeConfiguration<ContestSubmission>
{
    public void Configure(EntityTypeBuilder<ContestSubmission> builder)
    {
        builder.ToTable("ContestSubmissions");
        builder.HasOne<Contest>().WithMany().HasForeignKey(i => i.ContestId);
        builder.HasOne<Exercise>().WithMany().HasForeignKey(i => i.ExerciseId);
        builder.HasOne<User>().WithMany().HasForeignKey(i => i.StudentId);
    }
}