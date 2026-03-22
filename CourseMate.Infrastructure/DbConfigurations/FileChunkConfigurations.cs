using CourseMate.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Infrastructure.DbConfigurations;

public class FileChunkConfigurations : IEntityTypeConfiguration<FileChunk>
{
    public void Configure(EntityTypeBuilder<FileChunk> builder)
    {
        builder.ToTable("FileChunks");
        builder.HasOne<FileEntry>().WithMany().HasForeignKey(c => c.FileEntryId).OnDelete(DeleteBehavior.Cascade);
    }
}