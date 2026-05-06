using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public sealed class ContestConfiguration : IEntityTypeConfiguration<Contest>
{
    public void Configure(EntityTypeBuilder<Contest> builder)
    {
        builder.ToTable("Contests");
        builder.Property(i => i.Title).HasColumnType("citext").IsRequired();
        builder.Property(i => i.Description).HasColumnType("citext").IsRequired();
        builder.HasOne<IdentityUser<Guid>>().WithMany().HasForeignKey(i => i.CreatorId);
    }
}