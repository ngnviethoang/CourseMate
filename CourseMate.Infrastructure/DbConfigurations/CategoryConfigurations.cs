using CourseMate.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Core.DbConfigurations;

public class CategoryConfigurations : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("Categories");
        builder.Property(i => i.Name).HasColumnType("citext");
        builder.Property(i => i.Description).HasColumnType("citext");
    }
}