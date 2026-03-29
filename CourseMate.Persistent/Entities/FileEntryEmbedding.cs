using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Persistent.Entities.Abstracts;
using Pgvector;

namespace CourseMate.Persistent.Entities;

public class FileEntryEmbedding : Entity
{
    public FileEntryEmbedding(Guid id, Guid fileEntryId, Guid fileChunkId, int startIndex, int endIndex, string shortText, Vector embedding) : base(id)
    {
        FileEntryId = fileEntryId;
        StartIndex = startIndex;
        EndIndex = endIndex;
        ShortText = shortText;
        Embedding = embedding;
        FileChunkId = fileChunkId;
    }

    public Guid FileEntryId { get; set; }

    public Guid FileChunkId { get; set; }

    [Range(0, int.MaxValue)]
    public int StartIndex { get; set; }

    [Range(0, int.MaxValue)]
    public int EndIndex { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string ShortText { get; set; }

    public Vector Embedding { get; set; }
}