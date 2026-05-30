using CourseMate.Application.Commands.Files;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Contracts.Options;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.Tests.Commands.Files;

public class UploadVideoChunkCommandHandlerTests
{
    [Fact]
    public async Task Handle_ShouldStoreChunkWithNormalizedRelativePath_AndIncrementUploadedChunks()
    {
        Guid userId = Guid.NewGuid();
        string rootPath = CreateTempRootPath();
        StorageOptions storageOptions = new()
        {
            RootPath = rootPath,
            MaxChunkSizeMb = 10
        };

        try
        {
            TestDbContextScope scope = new(userId);
            CourseMateDbContext dbContext = scope.CreateWriteDbContext();
            Directory.CreateDirectory(storageOptions.TempPath);

            Guid fileId = Guid.NewGuid();
            FileEntry fileEntry = new(
                fileId,
                $"{fileId}.mp4",
                0,
                $"{userId}/{fileId}.mp4",
                FileStatus.Uploading,
                0,
                0,
                null,
                FileType.Video);
            dbContext.FileEntries.Add(fileEntry);
            await dbContext.SaveChangesAsync();

            UploadVideoChunkCommandHandler handler = new(
                dbContext,
                scope.HttpContextAccessor,
                Options.Create(storageOptions));

            byte[] content = [1, 2, 3, 4, 5];
            await handler.Handle(new UploadVideoChunkCommand
            {
                FileId = fileId,
                FileName = "chunk.mp4",
                ChunkIndex = 1,
                Content = content
            }, CancellationToken.None);
            await dbContext.SaveChangesAsync();

            FileChunk? storedChunk = dbContext.FileChunks.SingleOrDefault(c => c.FileEntryId == fileId && c.ChunkIndex == 1);
            FileEntry? updatedFileEntry = await dbContext.FileEntries.FindAsync(fileId);

            Assert.NotNull(storedChunk);
            Assert.NotNull(updatedFileEntry);
            Assert.Equal($"{fileId}_chunk_1.dat", storedChunk.ChunkLocation);
            Assert.Equal(1, updatedFileEntry.UploadedChunks);
            Assert.True(File.Exists(Path.Combine(storageOptions.TempPath, storedChunk.ChunkLocation)));
        }
        finally
        {
            DeleteDirectoryIfExists(rootPath);
        }
    }

    [Fact]
    public async Task Handle_ShouldThrowBusinessException_WhenFileExtensionIsInvalid()
    {
        Guid userId = Guid.NewGuid();
        string rootPath = CreateTempRootPath();
        StorageOptions storageOptions = new()
        {
            RootPath = rootPath,
            MaxChunkSizeMb = 10
        };

        try
        {
            TestDbContextScope scope = new(userId);
            CourseMateDbContext dbContext = scope.CreateWriteDbContext();
            Guid fileId = Guid.NewGuid();
            dbContext.FileEntries.Add(new FileEntry(
                fileId,
                $"{fileId}.mp4",
                0,
                $"{userId}/{fileId}.mp4",
                FileStatus.Uploading,
                0,
                0,
                null,
                FileType.Video));
            await dbContext.SaveChangesAsync();

            UploadVideoChunkCommandHandler handler = new(
                dbContext,
                scope.HttpContextAccessor,
                Options.Create(storageOptions));

            await Assert.ThrowsAsync<BusinessException>(() => handler.Handle(new UploadVideoChunkCommand
            {
                FileId = fileId,
                FileName = "chunk.txt",
                ChunkIndex = 1,
                Content = [1]
            }, CancellationToken.None));
        }
        finally
        {
            DeleteDirectoryIfExists(rootPath);
        }
    }

    private static string CreateTempRootPath()
    {
        return Path.Combine(Path.GetTempPath(), "coursemate-tests", Guid.NewGuid().ToString("N"));
    }

    private static void DeleteDirectoryIfExists(string path)
    {
        if (Directory.Exists(path))
        {
            Directory.Delete(path, true);
        }
    }
}