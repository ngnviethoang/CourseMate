using CourseMate.Infrastructure.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Infrastructure.DbConfigurations;

public class CourseConfigurations : IEntityTypeConfiguration<Course>
{
    public void Configure(EntityTypeBuilder<Course> builder)
    {
        builder.ToTable("Courses");
        builder.Property(i => i.Title).HasColumnType("citext").IsRequired();
        builder.Property(i => i.Description).HasColumnType("citext");
        builder.Property(i => i.ImageUrl).HasColumnType("citext");
        builder.HasOne<Category>().WithMany().HasForeignKey(i => i.CategoryId);
        builder.HasOne<IdentityUser<Guid>>().WithMany().HasForeignKey(i => i.InstructorId);
    }
}