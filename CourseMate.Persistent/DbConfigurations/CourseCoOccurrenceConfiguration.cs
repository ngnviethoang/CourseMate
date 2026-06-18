using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class CourseCoOccurrenceConfiguration : IEntityTypeConfiguration<CourseCoOccurrence>
{
    public void Configure(EntityTypeBuilder<CourseCoOccurrence> builder)
    {
        builder.ToTable("CourseCoOccurrences");
        builder.HasOne<Course>().WithMany().HasForeignKey(i => i.CourseId);
        builder.HasOne<Course>().WithMany().HasForeignKey(i => i.CoCourseId);
        builder.HasIndex(i => new { i.CourseId, i.Weight });
    }
}
