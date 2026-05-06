using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class ExerciseSubmissionConfiguration : IEntityTypeConfiguration<ExerciseSubmission>
{
    public void Configure(EntityTypeBuilder<ExerciseSubmission> builder)
    {
        builder.ToTable("ExerciseSubmissions");
        builder.HasOne<Exercise>().WithMany().HasForeignKey(i => i.ExerciseId);
    }
}