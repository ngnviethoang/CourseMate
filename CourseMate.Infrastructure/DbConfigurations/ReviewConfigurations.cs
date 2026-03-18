using CourseMate.Infrastructure.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Infrastructure.DbConfigurations;

public class ReviewConfigurations : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.ToTable("Reviews");
        builder.Property(i => i.Comment).HasColumnType("citext");
        builder.HasOne<Course>().WithMany().HasForeignKey(i => i.CourseId);
        builder.HasOne<IdentityUser<Guid>>().WithMany().HasForeignKey(i => i.StudentId);
    }
}