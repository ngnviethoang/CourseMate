using CourseMate.Application.Commands.Files;
using CourseMate.Application.Services.FileStorageServices;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Options;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.Tests.Commands.Files;

public class UploadVideoChunkCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldCreateChunkAndIncreaseUploadedChunks()
    {
        UploadVideoChunkCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.FileStorageManager,
            _testContainer.StorageOptions);

        UploadVideoChunkCommand request = new()
        {
            FileId = _testContainer.FileId,
            FileName = "video.mp4",
            ChunkIndex = 1,
            Content = "chunk-content"u8.ToArray()
        };

        await handler.Handle(request, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();

        FileChunk? chunk = await _testContainer.DbContext.FileChunks.AsNoTracking().FirstOrDefaultAsync(x => x.FileEntryId == _testContainer.FileId);
        FileEntry? fileEntry = await _testContainer.DbContext.FileEntries.AsNoTracking().FirstOrDefaultAsync(x => x.Id == _testContainer.FileId);

        Assert.NotNull(chunk);
        Assert.Equal(Path.Combine("temp", $"{_testContainer.FileId}_chunk_1.dat"), chunk.ChunkLocation);
        Assert.NotNull(fileEntry);
        Assert.Equal(1, fileEntry.UploadedChunks);

        bool exists = await _testContainer.FileStorageManager.ExistsAsync(StorageFileEntry.FromFileChunk(chunk));
        Assert.True(exists);
    }

    private sealed class TestContainer
    {
        public readonly CourseMateDbContext DbContext;
        public readonly Guid FileId = Guid.NewGuid();
        public readonly FakeStorageManager FileStorageManager = new();
        public readonly IHttpContextAccessor HttpContextAccessor;

        public readonly IOptions<StorageOptions> StorageOptions = Options.Create(new StorageOptions
        {
            MaxChunkSizeMb = 10,
            RootPath = "storage-root"
        });

        public readonly Guid UserId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope testDbContextScope = new(UserId, Roles.Admin);
            HttpContextAccessor = testDbContextScope.HttpContextAccessor;
            DbContext = testDbContextScope.CreateWriteDbContext();

            DbContext.FileEntries.Add(new FileEntry(FileId, "video.mp4", 0, Path.Combine(UserId.ToString(), "video.mp4"), FileStatus.Uploading, 0, 0, null, FileType.Video));
            DbContext.SaveChanges();
        }
    }
}