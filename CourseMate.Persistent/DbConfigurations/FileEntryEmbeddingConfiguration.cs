using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class FileEntryEmbeddingConfiguration : IEntityTypeConfiguration<FileEntryEmbedding>
{
    public void Configure(EntityTypeBuilder<FileEntryEmbedding> builder)
    {
        builder.ToTable("FileEntryEmbeddings");
        builder.HasOne<FileEntry>().WithMany().HasForeignKey(x => x.FileEntryId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne<FileChunk>().WithOne().HasForeignKey<FileEntryEmbedding>(x => x.FileChunkId).OnDelete(DeleteBehavior.Cascade);
        builder.Property(b => b.Embedding).HasColumnType("vector(1536)");
    }
}