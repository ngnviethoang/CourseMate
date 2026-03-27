using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class FileChunk : Entity
{
    public FileChunk(Guid id, Guid fileEntryId, int chunkIndex, string chunkPath, long chunkSize, bool isUploaded) : base(id)
    {
        FileEntryId = fileEntryId;
        ChunkIndex = chunkIndex;
        ChunkPath = chunkPath;
        ChunkSize = chunkSize;
        IsUploaded = isUploaded;
    }

    public Guid FileEntryId { get; set; }

    public int ChunkIndex { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string ChunkPath { get; set; }

    public long ChunkSize { get; set; }

    public bool IsUploaded { get; set; }
}