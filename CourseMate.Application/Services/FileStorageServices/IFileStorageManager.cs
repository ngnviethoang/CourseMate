namespace CourseMate.Application.Services.FileStorageServices;

public interface IFileStorageManager
{
    Task CreateAsync(IFileEntry fileEntry, Stream stream, CancellationToken cancellationToken = default);

    Task<Stream> ReadAsync(IFileEntry fileEntry, CancellationToken cancellationToken = default);

    Task<byte[]> ReadBytesAsync(IFileEntry fileEntry, CancellationToken cancellationToken = default);

    Task<bool> ExistsAsync(IFileEntry fileEntry, CancellationToken cancellationToken = default);

    Task DeleteAsync(IFileEntry fileEntry, CancellationToken cancellationToken = default);

    Task ArchiveAsync(IFileEntry fileEntry, CancellationToken cancellationToken = default);

    Task UnArchiveAsync(IFileEntry fileEntry, CancellationToken cancellationToken = default);
}