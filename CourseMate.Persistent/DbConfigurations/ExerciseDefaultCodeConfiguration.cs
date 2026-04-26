using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class ExerciseDefaultCodeConfiguration : IEntityTypeConfiguration<ExerciseDefaultCode>
{
    public void Configure(EntityTypeBuilder<ExerciseDefaultCode> builder)
    {
        builder.HasKey(x => x.Id);
    }
}
