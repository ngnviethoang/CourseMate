using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class UserRecommendationConfiguration : IEntityTypeConfiguration<UserRecommendation>
{
    public void Configure(EntityTypeBuilder<UserRecommendation> builder)
    {
        builder.ToTable("UserRecommendations");
        builder.HasOne<User>().WithMany().HasForeignKey(i => i.UserId);
        builder.HasOne<Course>().WithMany().HasForeignKey(i => i.CourseId);
        builder.HasIndex(i => new { i.UserId, i.Rank });
    }
}
