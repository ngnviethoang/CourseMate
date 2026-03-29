using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class LessonMaterialConfiguration : IEntityTypeConfiguration<LessonMaterial>
{
    public void Configure(EntityTypeBuilder<LessonMaterial> builder)
    {
        builder.ToTable("LessonMaterials");
        builder.HasOne<Lesson>().WithMany().HasForeignKey(x => x.LessonId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne<FileEntry>().WithOne().HasForeignKey<LessonMaterial>(x => x.DocumentFileId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne<FileEntry>().WithOne().HasForeignKey<LessonMaterial>(x => x.SlideFileId).OnDelete(DeleteBehavior.Cascade);
    }
}