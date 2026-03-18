using CourseMate.Infrastructure.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Infrastructure.DbConfigurations;

public class EnrollmentConfigurations : IEntityTypeConfiguration<Enrollment>
{
    public void Configure(EntityTypeBuilder<Enrollment> builder)
    {
        builder.ToTable("Enrollments");
        builder.HasOne<Course>().WithMany().HasForeignKey(i => i.CourseId);
        builder.HasOne<IdentityUser<Guid>>().WithMany().HasForeignKey(i => i.UserId);
    }
}