using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public sealed class ContestConfiguration : IEntityTypeConfiguration<Contest>
{
    public void Configure(EntityTypeBuilder<Contest> builder)
    {
        builder.ToTable("Contests");
        builder.Property(i => i.Title).HasColumnType("citext");
        builder.Property(i => i.Description).HasColumnType("citext");
        builder.HasOne<User>().WithMany().HasForeignKey(i => i.CreatorId);
    }
}