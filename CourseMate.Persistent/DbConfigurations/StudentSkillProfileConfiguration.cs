using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class StudentSkillProfileConfiguration : IEntityTypeConfiguration<StudentSkillProfile>
{
    public void Configure(EntityTypeBuilder<StudentSkillProfile> builder)
    {
        builder.ToTable("StudentSkillProfiles");
        builder.HasIndex(x => new { x.StudentId, x.Category, x.Difficulty }).IsUnique();
        builder.HasIndex(x => x.IsWeakArea);
        builder.HasOne<User>().WithMany().HasForeignKey(x => x.StudentId).OnDelete(DeleteBehavior.Cascade);
        builder.Property(x => x.Category).HasColumnType("citext");
    }
}
