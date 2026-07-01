using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class StudentPreferenceConfiguration : IEntityTypeConfiguration<StudentPreference>
{
    public void Configure(EntityTypeBuilder<StudentPreference> builder)
    {
        builder.ToTable("StudentPreferences");
        builder.HasIndex(x => x.StudentId).IsUnique();
        builder.HasOne<User>().WithMany().HasForeignKey(x => x.StudentId).OnDelete(DeleteBehavior.Cascade);
        builder.Property(x => x.FavouriteCategories).HasColumnType("text[]");
    }
}
