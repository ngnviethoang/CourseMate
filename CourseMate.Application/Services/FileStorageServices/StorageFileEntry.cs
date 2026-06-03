using CourseMate.Persistent.Entities;

namespace CourseMate.Application.Services.FileStorageServices;

public class StorageFileEntry : IFileEntry
{
    public Guid Id { get; set; }

    public string FileName { get; set; } = string.Empty;

    public string FileLocation { get; set; } = string.Empty;

    public static StorageFileEntry FromFileEntry(FileEntry fileEntry)
    {
        return new StorageFileEntry
        {
            Id = fileEntry.Id,
            FileName = fileEntry.FileName,
            FileLocation = fileEntry.FileLocation
        };
    }

    public static StorageFileEntry FromFileChunk(FileChunk fileChunk)
    {
        return new StorageFileEntry
        {
            Id = fileChunk.Id,
            FileName = Path.GetFileName(fileChunk.ChunkLocation),
            FileLocation = fileChunk.ChunkLocation
        };
    }
}