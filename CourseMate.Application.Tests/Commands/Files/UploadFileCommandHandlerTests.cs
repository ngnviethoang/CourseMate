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

public class UploadFileCommandHandlerTests
{
    [Fact]
    public async Task Handle_ShouldStoreFileEntryWithNormalizedRelativePath_AndReturnPublicUrl()
    {
        Guid userId = Guid.NewGuid();
        string rootPath = CreateTempRootPath();
        StorageOptions storageOptions = new()
        {
            RootPath = rootPath,
            StaticRequestPath = "/files"
        };

        try
        {
            TestDbContextScope scope = new(userId);
            scope.HttpContextAccessor.HttpContext!.Request.Scheme = "https";
            scope.HttpContextAccessor.HttpContext!.Request.Host = new HostString("example.local");
            CourseMateDbContext dbContext = scope.CreateWriteDbContext();

            UploadFileCommandHandler handler = new(
                dbContext,
                scope.HttpContextAccessor,
                Options.Create(storageOptions));

            byte[] content = [9, 8, 7];
            FileUploadResponse result = await handler.Handle(new UploadFileCommand
            {
                FileName = "avatar.png",
                ContentType = "image/png",
                Content = content
            }, CancellationToken.None);
            await dbContext.SaveChangesAsync();

            FileEntry? entry = await dbContext.FileEntries.FindAsync(result.FileId);

            Assert.NotNull(entry);
            Assert.Equal(FileStatus.Completed, entry.Status);
            Assert.Equal(FileType.Image, entry.FileType);
            Assert.StartsWith("public/", entry.FileLocation.Replace('\\', '/'));
            Assert.Equal($"https://example.local/files/{entry.FileName}", result.FileUrl);
            Assert.True(File.Exists(Path.Combine(rootPath, entry.FileLocation.Replace('/', Path.DirectorySeparatorChar))));
        }
        finally
        {
            DeleteDirectoryIfExists(rootPath);
        }
    }

    [Fact]
    public async Task Handle_ShouldThrowBusinessException_WhenExtensionNotAllowed()
    {
        Guid userId = Guid.NewGuid();
        string rootPath = CreateTempRootPath();
        StorageOptions storageOptions = new()
        {
            RootPath = rootPath,
            StaticRequestPath = "/files"
        };

        try
        {
            TestDbContextScope scope = new(userId);
            CourseMateDbContext dbContext = scope.CreateWriteDbContext();
            UploadFileCommandHandler handler = new(
                dbContext,
                scope.HttpContextAccessor,
                Options.Create(storageOptions));

            await Assert.ThrowsAsync<BusinessException>(() => handler.Handle(new UploadFileCommand
            {
                FileName = "malware.exe",
                ContentType = "application/octet-stream",
                Content = [1, 2, 3]
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