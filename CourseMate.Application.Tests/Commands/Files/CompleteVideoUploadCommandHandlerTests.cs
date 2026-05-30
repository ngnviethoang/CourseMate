using CourseMate.Application.Commands.Files;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Contracts.Options;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.Tests.Commands.Files;

public class CompleteVideoUploadCommandHandlerTests
{
    [Fact]
    public async Task Handle_ShouldMergeChunks_DeleteTempFiles_AndUpdateFileMetadata()
    {
        Guid userId = Guid.NewGuid();
        string rootPath = CreateTempRootPath();
        StorageOptions storageOptions = new()
        {
            RootPath = rootPath
        };

        try
        {
            TestDbContextScope scope = new(userId);
            scope.HttpContextAccessor.HttpContext!.Request.Scheme = "https";
            scope.HttpContextAccessor.HttpContext!.Request.Host = new HostString("localhost");
            CourseMateDbContext dbContext = scope.CreateWriteDbContext();

            string userDir = Path.Combine(rootPath, userId.ToString());
            Directory.CreateDirectory(userDir);
            Directory.CreateDirectory(storageOptions.TempPath);

            Guid fileId = Guid.NewGuid();
            string fileLocation = $"{userId}/{fileId}.mp4";
            FileEntry fileEntry = new(
                fileId,
                $"{fileId}.mp4",
                0,
                fileLocation,
                FileStatus.Uploading,
                0,
                2,
                null,
                FileType.Video);
            dbContext.FileEntries.Add(fileEntry);

            string chunk1Name = $"{fileId}_chunk_1.dat";
            string chunk2Name = $"{fileId}_chunk_2.dat";
            byte[] chunk1 = [1, 2, 3];
            byte[] chunk2 = [4, 5, 6, 7];

            await File.WriteAllBytesAsync(Path.Combine(storageOptions.TempPath, chunk1Name), chunk1);
            await File.WriteAllBytesAsync(Path.Combine(storageOptions.TempPath, chunk2Name), chunk2);

            dbContext.FileChunks.AddRange(
                new FileChunk(Guid.NewGuid(), fileId, 1, chunk1Name, chunk1.Length, true),
                new FileChunk(Guid.NewGuid(), fileId, 2, chunk2Name, chunk2.Length, true));
            await dbContext.SaveChangesAsync();

            CompleteVideoUploadCommandHandler handler = new(
                Options.Create(storageOptions),
                dbContext,
                scope.HttpContextAccessor);

            FileUploadResponse result = await handler.Handle(new CompletedVideoUploadCommand
            {
                FileId = fileId,
                TotalChunks = 2
            }, CancellationToken.None);

            Assert.Equal(fileId, result.FileId);
            Assert.Equal($"https://localhost/api/files/videos/stream/{fileId}", result.FileUrl);

            Assert.Equal(FileStatus.Completed, fileEntry.Status);
            Assert.NotNull(fileEntry.CompletedAt);
            Assert.Equal(2, fileEntry.TotalChunks);
            Assert.Equal(chunk1.Length + chunk2.Length, fileEntry.FileSize);

            string outputFilePath = Path.Combine(rootPath, fileLocation);
            Assert.True(File.Exists(outputFilePath));
            byte[] merged = await File.ReadAllBytesAsync(outputFilePath);
            Assert.Equal(chunk1.Concat(chunk2).ToArray(), merged);

            Assert.False(File.Exists(Path.Combine(storageOptions.TempPath, chunk1Name)));
            Assert.False(File.Exists(Path.Combine(storageOptions.TempPath, chunk2Name)));
        }
        finally
        {
            DeleteDirectoryIfExists(rootPath);
        }
    }

    [Fact]
    public async Task Handle_ShouldThrowBusinessException_WhenChunkFileMissingInTempPath()
    {
        Guid userId = Guid.NewGuid();
        string rootPath = CreateTempRootPath();
        StorageOptions storageOptions = new()
        {
            RootPath = rootPath
        };

        try
        {
            TestDbContextScope scope = new(userId);
            CourseMateDbContext dbContext = scope.CreateWriteDbContext();
            Directory.CreateDirectory(storageOptions.TempPath);

            Guid fileId = Guid.NewGuid();
            dbContext.FileEntries.Add(new FileEntry(
                fileId,
                $"{fileId}.mp4",
                0,
                $"{userId}/{fileId}.mp4",
                FileStatus.Uploading,
                0,
                1,
                null,
                FileType.Video));
            dbContext.FileChunks.Add(new FileChunk(Guid.NewGuid(), fileId, 1, $"{fileId}_chunk_1.dat", 5, true));
            await dbContext.SaveChangesAsync();

            CompleteVideoUploadCommandHandler handler = new(
                Options.Create(storageOptions),
                dbContext,
                scope.HttpContextAccessor);

            await Assert.ThrowsAsync<BusinessException>(() => handler.Handle(new CompletedVideoUploadCommand
            {
                FileId = fileId,
                TotalChunks = 1
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