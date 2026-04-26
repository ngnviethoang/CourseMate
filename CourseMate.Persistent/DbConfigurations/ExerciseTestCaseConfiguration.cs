using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class ExerciseTestCaseConfiguration : IEntityTypeConfiguration<ExerciseTestCase>
{
    public void Configure(EntityTypeBuilder<ExerciseTestCase> builder)
    {
        builder.ToTable("ExerciseTestCases");
    }
}