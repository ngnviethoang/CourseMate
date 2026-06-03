using CourseMate.Application.Commands.Files;
using CourseMate.Application.Services.FileStorageServices;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Contracts.Options;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.Tests.Commands.Files;

public class UploadFileCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldCreateFileEntryAndStoreContent_WhenFileIsValid()
    {
        UploadFileCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.FileStorageManager,
            _testContainer.StorageOptions);

        UploadFileCommand request = new()
        {
            FileName = "guide.pdf",
            ContentType = "application/pdf",
            Content = "test-content"u8.ToArray()
        };

        FileUploadResponse result = await handler.Handle(request, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();

        FileEntry? created = await _testContainer.DbContext.FileEntries.AsNoTracking().FirstOrDefaultAsync(x => x.Id == result.FileId);
        Assert.NotNull(created);
        Assert.Equal(FileType.Document, created.FileType);
        Assert.Equal(FileStatus.Completed, created.Status);
        Assert.StartsWith("public", created.FileLocation);
        Assert.Contains(created.FileName, result.FileUrl);

        bool exists = await _testContainer.FileStorageManager.ExistsAsync(StorageFileEntry.FromFileEntry(created));
        Assert.True(exists);

        byte[] stored = await _testContainer.FileStorageManager.ReadBytesAsync(StorageFileEntry.FromFileEntry(created));
        Assert.Equal(request.Content, stored);
    }

    [Fact]
    public async Task Handle_ShouldThrowBusinessException_WhenExtensionIsInvalid()
    {
        UploadFileCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.FileStorageManager,
            _testContainer.StorageOptions);

        UploadFileCommand request = new()
        {
            FileName = "script.exe",
            ContentType = "application/octet-stream",
            Content = [1, 2, 3]
        };

        BusinessException exception = await Assert.ThrowsAsync<BusinessException>(() => handler.Handle(request, CancellationToken.None));

        Assert.Equal(ErrorCode.InvalidFileType, exception.ErrorCode);
    }

    private sealed class TestContainer
    {
        public readonly CourseMateDbContext DbContext;
        public readonly FakeStorageManager FileStorageManager = new();
        public readonly IHttpContextAccessor HttpContextAccessor;

        public readonly IOptions<StorageOptions> StorageOptions = Options.Create(new StorageOptions
        {
            RootPath = "storage-root",
            StaticRequestPath = "/coursemate-files"
        });

        public readonly Guid UserId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope testDbContextScope = new(UserId, Roles.Admin);
            HttpContextAccessor = testDbContextScope.HttpContextAccessor;
            HttpContextAccessor.HttpContext!.Request.Scheme = "https";
            HttpContextAccessor.HttpContext.Request.Host = new HostString("localhost");
            DbContext = testDbContextScope.CreateWriteDbContext();
        }
    }
}