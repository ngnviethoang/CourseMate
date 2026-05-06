using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public sealed class ContestExerciseConfiguration : IEntityTypeConfiguration<ContestExercise>
{
    public void Configure(EntityTypeBuilder<ContestExercise> builder)
    {
        builder.ToTable("ContestExercises");
        builder.HasOne<Contest>().WithMany().HasForeignKey(i => i.ContestId);
        builder.HasOne<Exercise>().WithMany().HasForeignKey(i => i.ExerciseId);
    }
}