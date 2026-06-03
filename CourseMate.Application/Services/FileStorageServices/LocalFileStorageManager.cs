using CourseMate.Contracts.Options;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.Services.FileStorageServices;

public class LocalFileStorageManager : IFileStorageManager
{
    private readonly StorageOptions _options;

    public LocalFileStorageManager(IOptions<StorageOptions> options)
    {
        _options = options.Value;
    }

    public async Task CreateAsync(IFileEntry fileEntry, Stream stream, CancellationToken cancellationToken = default)
    {
        string filePath = GetPath(fileEntry);
        string? folder = Path.GetDirectoryName(filePath);
        if (!string.IsNullOrWhiteSpace(folder) && !Directory.Exists(folder))
        {
            Directory.CreateDirectory(folder);
        }

        await using FileStream fileStream = new(filePath, FileMode.Create, FileAccess.Write, FileShare.None);
        if (stream.CanSeek)
        {
            stream.Position = 0;
        }

        await stream.CopyToAsync(fileStream, cancellationToken);
    }

    public Task<Stream> ReadAsync(IFileEntry fileEntry, CancellationToken cancellationToken = default)
    {
        Stream stream = new FileStream(GetExistingPath(fileEntry), FileMode.Open, FileAccess.Read, FileShare.Read);
        return Task.FromResult(stream);
    }

    public Task<byte[]> ReadBytesAsync(IFileEntry fileEntry, CancellationToken cancellationToken = default)
    {
        return File.ReadAllBytesAsync(GetExistingPath(fileEntry), cancellationToken);
    }

    public Task<bool> ExistsAsync(IFileEntry fileEntry, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(File.Exists(GetExistingPath(fileEntry)));
    }

    public Task DeleteAsync(IFileEntry fileEntry, CancellationToken cancellationToken = default)
    {
        string filePath = GetExistingPath(fileEntry);
        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }

        return Task.CompletedTask;
    }

    public Task ArchiveAsync(IFileEntry fileEntry, CancellationToken cancellationToken = default)
    {
        return Task.CompletedTask;
    }

    public Task UnArchiveAsync(IFileEntry fileEntry, CancellationToken cancellationToken = default)
    {
        return Task.CompletedTask;
    }

    private string GetPath(IFileEntry fileEntry)
    {
        return Path.IsPathRooted(fileEntry.FileLocation)
            ? fileEntry.FileLocation
            : Path.Combine(_options.RootPath, fileEntry.FileLocation);
    }

    private string GetExistingPath(IFileEntry fileEntry)
    {
        if (Path.IsPathRooted(fileEntry.FileLocation))
        {
            return fileEntry.FileLocation;
        }

        string rootPath = Path.Combine(_options.RootPath, fileEntry.FileLocation);
        if (File.Exists(rootPath))
        {
            return rootPath;
        }

        string tempPath = Path.Combine(_options.TempPath, fileEntry.FileLocation);
        return File.Exists(tempPath) ? tempPath : rootPath;
    }
}