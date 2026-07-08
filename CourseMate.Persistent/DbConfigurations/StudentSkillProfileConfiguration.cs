using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class StudentSkillProfileConfiguration : IEntityTypeConfiguration<StudentSkillProfile>
{
    public void Configure(EntityTypeBuilder<StudentSkillProfile> builder)
    {
        builder.ToTable("StudentSkillProfiles");
        builder.HasIndex(i => new { i.StudentId, i.Category, i.Difficulty }).IsUnique();
        builder.Property(i => i.Category).HasColumnType("citext");
    }
}

public class StudentPreferenceConfiguration : IEntityTypeConfiguration<StudentPreference>
{
    public void Configure(EntityTypeBuilder<StudentPreference> builder)
    {
        builder.ToTable("StudentPreferences");
        builder.HasIndex(i => i.StudentId).IsUnique();
        builder.Property(i => i.FavouriteCategories).HasColumnType("jsonb").HasDefaultValueSql("'[]'::jsonb");
        builder.Property(i => i.LearningGoal).HasColumnType("citext");
        builder.Property(i => i.SkillLevel).HasColumnType("citext");
    }
}