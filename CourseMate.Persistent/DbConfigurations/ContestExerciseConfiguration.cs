using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

internal sealed class ContestExerciseConfiguration : IEntityTypeConfiguration<ContestExercise>
{
    public void Configure(EntityTypeBuilder<ContestExercise> builder)
    {
        builder.ToTable("ContestExercises");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.ContestId).IsRequired();
        builder.Property(x => x.ExerciseId).IsRequired();
        builder.Property(x => x.ScoreWeight).IsRequired();
        builder.Property(x => x.Order).IsRequired();

        builder.HasOne(x => x.Exercise)
            .WithMany()
            .HasForeignKey(x => x.ExerciseId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
