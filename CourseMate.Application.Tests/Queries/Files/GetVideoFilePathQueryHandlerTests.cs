using CourseMate.Application.Queries.Files;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Options;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.Tests.Queries.Files;

public class GetVideoFilePathQueryHandlerTests
{
    [Fact]
    public async Task Handle_ShouldReturnAbsoluteFilePath_ForCompletedVideoFile()
    {
        Guid userId = Guid.NewGuid();
        Guid fileId = Guid.NewGuid();
        string rootPath = Path.Combine(Path.GetTempPath(), "coursemate-tests", Guid.NewGuid().ToString("N"));

        try
        {
            TestDbContextScope scope = new(userId);
            CourseMateDbContext dbContext = scope.CreateWriteDbContext();
            CourseMateReadOnlyDbContext readOnlyDbContext = scope.CreateReadOnlyDbContext();

            dbContext.FileEntries.Add(new FileEntry(
                fileId,
                "lesson.mp4",
                1024,
                "user-1/lesson.mp4",
                FileStatus.Completed,
                1,
                1,
                DateTimeOffset.UtcNow,
                FileType.Video));
            await dbContext.SaveChangesAsync();

            GetVideoFilePathQueryHandler handler = new(
                Options.Create(new StorageOptions { RootPath = rootPath }),
                readOnlyDbContext,
                scope.HttpContextAccessor);

            VideoFilePathDto? result = await handler.Handle(new GetVideoFilePathQuery { FileId = fileId }, CancellationToken.None);

            Assert.NotNull(result);
            Assert.Equal(Path.Combine(rootPath, "user-1/lesson.mp4"), result.FilePath);
            Assert.Equal("lesson.mp4", result.FileName);
        }
        finally
        {
            if (Directory.Exists(rootPath))
            {
                Directory.Delete(rootPath, true);
            }
        }
    }

    [Fact]
    public async Task Handle_ShouldReturnNull_WhenFileIsNotCompletedVideo()
    {
        Guid userId = Guid.NewGuid();
        Guid fileId = Guid.NewGuid();

        TestDbContextScope scope = new(userId);
        CourseMateDbContext dbContext = scope.CreateWriteDbContext();
        CourseMateReadOnlyDbContext readOnlyDbContext = scope.CreateReadOnlyDbContext();

        dbContext.FileEntries.Add(new FileEntry(
            fileId,
            "doc.pdf",
            1,
            "public/doc.pdf",
            FileStatus.Completed,
            1,
            1,
            DateTimeOffset.UtcNow,
            FileType.Document));
        await dbContext.SaveChangesAsync();

        GetVideoFilePathQueryHandler handler = new(
            Options.Create(new StorageOptions { RootPath = "D:\\storage-root" }),
            readOnlyDbContext,
            scope.HttpContextAccessor);

        VideoFilePathDto? result = await handler.Handle(new GetVideoFilePathQuery { FileId = fileId }, CancellationToken.None);

        Assert.Null(result);
    }
}