using CourseMate.Application.Commands.Files;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Options;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.Tests.Commands.Files;

public class InitVideoUploadCommandHandlerTests
{
    [Fact]
    public async Task Handle_ShouldCreateUploadingFileEntry_WithNormalizedRelativePath()
    {
        Guid userId = Guid.NewGuid();
        string rootPath = CreateTempRootPath();

        try
        {
            TestDbContextScope scope = new(userId);
            CourseMateDbContext dbContext = scope.CreateWriteDbContext();
            StorageOptions storageOptions = new()
            {
                RootPath = rootPath
            };

            InitVideoUploadCommandHandler handler = new(
                dbContext,
                scope.HttpContextAccessor,
                Options.Create(storageOptions));

            InitVideoUploadResponse result = await handler.Handle(new InitVideoUploadCommand(), CancellationToken.None);
            await dbContext.SaveChangesAsync();

            FileEntry? fileEntry = await dbContext.FileEntries.FindAsync(result.FileId);

            Assert.NotNull(fileEntry);
            Assert.Equal(FileStatus.Uploading, fileEntry.Status);
            Assert.Equal(FileType.Video, fileEntry.FileType);
            Assert.Equal($"{result.FileId}.mp4", fileEntry.FileName);
            Assert.Equal($"{userId}/{result.FileId}.mp4", fileEntry.FileLocation.Replace('\\', '/'));
            Assert.True(Directory.Exists(Path.Combine(rootPath, userId.ToString())));
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