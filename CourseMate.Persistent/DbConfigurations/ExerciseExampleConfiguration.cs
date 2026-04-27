using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class ExerciseExampleConfiguration : IEntityTypeConfiguration<ExerciseExample>
{
    public void Configure(EntityTypeBuilder<ExerciseExample> builder)
    {
        builder.ToTable("ExerciseExamples");
        builder.HasOne<Exercise>().WithMany().HasForeignKey(i => i.ExerciseId);
    }
}