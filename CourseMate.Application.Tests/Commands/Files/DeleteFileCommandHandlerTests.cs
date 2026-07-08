using CourseMate.Application.Commands.Files;
using CourseMate.Application.Services.FileStorageServices;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Tests.Commands.Files;

public class DeleteFileCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldDeleteFileEntryAndChunksFromStorage()
    {
        DeleteFileCommandHandler handler = new(
            _testContainer.FileStorageManager,
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor);

        await handler.Handle(new DeleteFileCommand { FileId = _testContainer.FileId }, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();

        FileEntry? fileEntry = await _testContainer.DbContext.FileEntries.AsNoTracking().FirstOrDefaultAsync(x => x.Id == _testContainer.FileId);
        List<FileChunk> chunks = await _testContainer.DbContext.FileChunks.AsNoTracking().Where(x => x.FileEntryId == _testContainer.FileId).ToListAsync();

        Assert.Null(fileEntry);
        Assert.Empty(chunks);
        Assert.False(await _testContainer.FileStorageManager.ExistsAsync(_testContainer.StoredFile));
        Assert.False(await _testContainer.FileStorageManager.ExistsAsync(_testContainer.StoredChunk));
    }

    private sealed class TestContainer
    {
        public readonly CourseMateDbContext DbContext;
        public readonly Guid FileId = Guid.NewGuid();
        public readonly FakeStorageManager FileStorageManager = new();
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly StorageFileEntry StoredChunk;
        public readonly StorageFileEntry StoredFile;
        public readonly Guid UserId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope testDbContextScope = new(UserId, Roles.Admin);
            HttpContextAccessor = testDbContextScope.HttpContextAccessor;
            DbContext = testDbContextScope.CreateWriteDbContext();

            FileEntry fileEntry = new(FileId, "guide.pdf", 12, "public/guide.pdf", FileStatus.Completed, 1, 1, DateTimeOffset.UtcNow, FileType.Document);
            DbContext.FileEntries.Add(fileEntry);

            FileChunk fileChunk = new(Guid.NewGuid(), FileId, 1, Path.Combine("temp", "chunk-1.dat"), 5, true);
            DbContext.FileChunks.Add(fileChunk);
            DbContext.SaveChanges();

            StoredFile = StorageFileEntry.FromFileEntry(fileEntry);
            StoredChunk = StorageFileEntry.FromFileChunk(fileChunk);

            using MemoryStream fileStream = new("file-content"u8.ToArray());
            FileStorageManager.CreateAsync(StoredFile, fileStream).GetAwaiter().GetResult();
            using MemoryStream chunkStream = new("chunk"u8.ToArray());
            FileStorageManager.CreateAsync(StoredChunk, chunkStream).GetAwaiter().GetResult();
        }
    }
}