using System.Text.Json;
using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class ExerciseConfiguration : IEntityTypeConfiguration<Exercise>
{
    public void Configure(EntityTypeBuilder<Exercise> builder)
    {
        builder.ToTable("Exercises");
        builder.Property(i => i.Title).HasColumnType("citext").IsRequired();
        builder.Property(i => i.Description).HasColumnType("citext");

        builder.Property(x => x.Examples)
            .HasColumnType("jsonb")
            .HasConversion(
                v => JsonSerializer.Serialize(v, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }),
                v => JsonSerializer.Deserialize<List<ExerciseExample>>(v, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }) ?? new List<ExerciseExample>())
            .HasDefaultValueSql("'[]'::jsonb");

        builder.Property(x => x.Constraints).HasColumnType("jsonb").HasDefaultValueSql("'[]'::jsonb");
        builder.Property(x => x.Hints).HasColumnType("jsonb").HasDefaultValueSql("'[]'::jsonb");

        builder.HasMany(x => x.TestCases)
            .WithOne(x => x.Exercise)
            .HasForeignKey(x => x.ExerciseId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.DefaultCodes)
            .WithOne(x => x.Exercise)
            .HasForeignKey(x => x.ExerciseId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}