using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public sealed class AntiCheatViolationConfiguration : IEntityTypeConfiguration<AntiCheatViolation>
{
    public void Configure(EntityTypeBuilder<AntiCheatViolation> builder)
    {
        builder.ToTable("AntiCheatViolations");
        builder.HasOne<Contest>().WithMany().HasForeignKey(i => i.ContestId);
        builder.HasOne<IdentityUser<Guid>>().WithMany().HasForeignKey(i => i.StudentId);
        builder.HasIndex(i => new { i.ContestId, i.StudentId });
    }
}