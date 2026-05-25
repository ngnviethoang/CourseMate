using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public sealed class ContestRegistrationConfiguration : IEntityTypeConfiguration<ContestRegistration>
{
    public void Configure(EntityTypeBuilder<ContestRegistration> builder)
    {
        builder.ToTable("ContestRegistrations");
        builder.HasOne<Contest>().WithMany().HasForeignKey(i => i.ContestId);
        builder.HasOne<User>().WithMany().HasForeignKey(i => i.StudentId);
    }
}