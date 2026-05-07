using CourseMate.Persistent.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CourseMate.Persistent.DbConfigurations;

public class FileEntryEmbeddingConfiguration : IEntityTypeConfiguration<FileEntryEmbedding>
{
    public void Configure(EntityTypeBuilder<FileEntryEmbedding> builder)
    {
        builder.ToTable("FileEntryEmbeddings");
        builder.HasOne<FileEntry>().WithMany().HasForeignKey(x => x.FileEntryId);
        builder.HasOne<FileChunk>().WithOne().HasForeignKey<FileEntryEmbedding>(x => x.FileChunkId);
        builder.Property(b => b.Embedding).HasColumnType("vector(768)");
    }
}