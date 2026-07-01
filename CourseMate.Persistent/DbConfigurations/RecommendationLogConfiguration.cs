using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class RecommendationLogConfiguration : IEntityTypeConfiguration<RecommendationLog>
{
    public void Configure(EntityTypeBuilder<RecommendationLog> builder)
    {
        builder.ToTable("RecommendationLogs");
        builder.HasIndex(x => new { x.StudentId, x.RecommendationType });
        builder.HasIndex(x => x.CreationTime);
        builder.HasOne<User>().WithMany().HasForeignKey(x => x.StudentId).OnDelete(DeleteBehavior.Cascade);
    }
}
