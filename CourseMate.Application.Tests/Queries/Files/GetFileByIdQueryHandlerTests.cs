using System.Text;
using CourseMate.Application.Queries.Files;
using CourseMate.Application.Services.FileStorageServices;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Tests.Queries.Files;

public class GetFileByIdQueryHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldReturnFileContent_WhenFileExists()
    {
        GetFileByIdQueryHandler handler = new(
            _testContainer.FileStorageManager,
            _testContainer.ReadOnlyDbContext,
            _testContainer.HttpContextAccessor);

        FileContentResponse? result = await handler.Handle(new GetFileByIdQuery { FileId = _testContainer.FileId }, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal("guide.pdf", result.FileName);
        Assert.Equal("stored-content", Encoding.UTF8.GetString(result.Content));
    }

    [Fact]
    public async Task Handle_ShouldReturnNull_WhenStorageFileDoesNotExist()
    {
        GetFileByIdQueryHandler handler = new(
            _testContainer.FileStorageManager,
            _testContainer.ReadOnlyDbContext,
            _testContainer.HttpContextAccessor);

        await _testContainer.FileStorageManager.DeleteAsync(new StorageFileEntry
        {
            Id = _testContainer.FileId,
            FileName = "guide.pdf",
            FileLocation = "public/guide.pdf"
        });

        FileContentResponse? result = await handler.Handle(new GetFileByIdQuery { FileId = _testContainer.FileId }, CancellationToken.None);

        Assert.Null(result);
    }

    private sealed class TestContainer
    {
        public readonly CourseMateDbContext DbContext;
        public readonly Guid FileId = Guid.NewGuid();
        public readonly FakeStorageManager FileStorageManager = new();
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly CourseMateReadOnlyDbContext ReadOnlyDbContext;
        public readonly Guid UserId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope testDbContextScope = new(UserId, Roles.Admin);
            HttpContextAccessor = testDbContextScope.HttpContextAccessor;
            DbContext = testDbContextScope.CreateWriteDbContext();
            ReadOnlyDbContext = testDbContextScope.CreateReadOnlyDbContext();

            FileEntry fileEntry = new(FileId, "guide.pdf", 12, "public/guide.pdf", FileStatus.Completed, 1, 1, DateTimeOffset.UtcNow, FileType.Document);
            DbContext.FileEntries.Add(fileEntry);
            DbContext.SaveChanges();

            using MemoryStream stream = new("stored-content"u8.ToArray());
            FileStorageManager.CreateAsync(StorageFileEntry.FromFileEntry(fileEntry), stream).GetAwaiter().GetResult();
        }
    }
}