using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

internal sealed class ContestRegistrationConfiguration : IEntityTypeConfiguration<ContestRegistration>
{
    public void Configure(EntityTypeBuilder<ContestRegistration> builder)
    {
        builder.ToTable("ContestRegistrations");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.ContestId).IsRequired();
        builder.Property(x => x.StudentId).IsRequired();
        builder.Property(x => x.RegistrationTime).IsRequired();
        builder.Property(x => x.IsDisqualified).IsRequired();
    }
}
