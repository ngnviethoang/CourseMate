using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class ExerciseDefaultCodeConfiguration : IEntityTypeConfiguration<ExerciseDefaultCode>
{
    public void Configure(EntityTypeBuilder<ExerciseDefaultCode> builder)
    {
        builder.ToTable("ExerciseDefaultCodes");
        builder.HasOne<Exercise>().WithMany().HasForeignKey(i => i.ExerciseId);
    }
}