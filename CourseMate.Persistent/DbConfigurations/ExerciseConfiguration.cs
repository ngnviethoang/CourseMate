using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class ExerciseConfiguration : IEntityTypeConfiguration<Exercise>
{
    public void Configure(EntityTypeBuilder<Exercise> builder)
    {
        builder.ToTable("Exercises");
        builder.Property(i => i.Title).HasColumnType("citext");
        builder.Property(i => i.Description).HasColumnType("citext");
        builder.Property(x => x.Constraints).HasColumnType("jsonb").HasDefaultValueSql("'[]'::jsonb");
        builder.Property(x => x.Hints).HasColumnType("jsonb").HasDefaultValueSql("'[]'::jsonb");
    }
}