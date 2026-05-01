using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

internal sealed class ContestSubmissionConfiguration : IEntityTypeConfiguration<ContestSubmission>
{
    public void Configure(EntityTypeBuilder<ContestSubmission> builder)
    {
        builder.ToTable("ContestSubmissions");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.ContestId).IsRequired();
        builder.Property(x => x.ExerciseId).IsRequired();
        builder.Property(x => x.StudentId).IsRequired();
        builder.Property(x => x.Language).IsRequired();
        builder.Property(x => x.Code).IsRequired();
        builder.Property(x => x.Score).IsRequired();
        builder.Property(x => x.TotalTime).IsRequired();
        builder.Property(x => x.TotalMemory).IsRequired();
        builder.Property(x => x.IsFinal).IsRequired();

        builder.HasOne(x => x.Exercise)
            .WithMany()
            .HasForeignKey(x => x.ExerciseId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
