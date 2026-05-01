using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

internal sealed class ContestConfiguration : IEntityTypeConfiguration<Contest>
{
    public void Configure(EntityTypeBuilder<Contest> builder)
    {
        builder.ToTable("Contests");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title).IsRequired();
        builder.Property(x => x.Description).IsRequired();
        builder.Property(x => x.Status).IsRequired();
        builder.Property(x => x.DurationInMinutes).IsRequired();
        builder.Property(x => x.AllowedLanguages).IsRequired();
        builder.Property(x => x.MemoryLimit).IsRequired();
        builder.Property(x => x.TimeLimit).IsRequired();
        builder.Property(x => x.AntiCheatLevel).IsRequired();
        builder.Property(x => x.CreatorId).IsRequired();

        builder.HasMany(x => x.ContestExercises)
            .WithOne(x => x.Contest)
            .HasForeignKey(x => x.ContestId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.ContestRegistrations)
            .WithOne(x => x.Contest)
            .HasForeignKey(x => x.ContestId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.ContestSubmissions)
            .WithOne(x => x.Contest)
            .HasForeignKey(x => x.ContestId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
