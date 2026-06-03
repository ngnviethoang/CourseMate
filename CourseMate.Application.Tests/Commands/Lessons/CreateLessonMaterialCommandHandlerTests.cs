using CourseMate.Application.Commands.Lessons;
using CourseMate.Application.Services.FileStorageServices;
using CourseMate.Application.Tests.TestInfrastructure;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace CourseMate.Application.Tests.Commands.Lessons;

public class CreateLessonMaterialCommandHandlerTests
{
    private readonly TestContainer _testContainer = new();

    [Fact]
    public async Task Handle_ShouldCreateFileEntryAndLessonMaterial_WhenRequestIsValid()
    {
        CreateLessonMaterialCommandHandler handler = new(
            _testContainer.DbContext,
            _testContainer.HttpContextAccessor,
            _testContainer.FileStorageManager,
            _testContainer.Mediator.Object);

        CreateLessonMaterialCommand request = new()
        {
            LessonId = _testContainer.LessonId,
            FileName = "outline.docx",
            Content = "lesson-material"u8.ToArray(),
            PromptType = LessonMaterialPromptType.Reading
        };

        ProcessingStatusDto result = await handler.Handle(request, CancellationToken.None);
        await _testContainer.DbContext.SaveChangesAsync();

        LessonMaterial? lessonMaterial = await _testContainer.DbContext.LessonMaterials.AsNoTracking().FirstOrDefaultAsync(x => x.Id == result.LessonMaterialId);
        Assert.NotNull(lessonMaterial);
        Assert.Equal(_testContainer.LessonId, lessonMaterial.LessonId);
        Assert.Equal(LessonMaterialState.GeneratingEmbedding, lessonMaterial.Status);

        FileEntry? fileEntry = await _testContainer.DbContext.FileEntries.AsNoTracking().FirstOrDefaultAsync(x => x.Id == lessonMaterial.DocumentFileId);
        Assert.NotNull(fileEntry);
        Assert.Equal(FileStatus.Processing, fileEntry.Status);
        Assert.Equal(FileType.Document, fileEntry.FileType);
        Assert.StartsWith(_testContainer.UserId.ToString(), fileEntry.FileLocation);
        Assert.True(await _testContainer.FileStorageManager.ExistsAsync(StorageFileEntry.FromFileEntry(fileEntry)));
    }

    private sealed class TestContainer
    {
        public readonly CourseMateDbContext DbContext;
        public readonly FakeStorageManager FileStorageManager = new();
        public readonly IHttpContextAccessor HttpContextAccessor;
        public readonly Guid LessonId = Guid.NewGuid();
        public readonly Mock<IMediator> Mediator = new();
        public readonly Guid UserId = Guid.NewGuid();

        public TestContainer()
        {
            TestDbContextScope testDbContextScope = new(UserId, Roles.Admin);
            HttpContextAccessor = testDbContextScope.HttpContextAccessor;
            DbContext = testDbContextScope.CreateWriteDbContext();

            Guid categoryId = Guid.NewGuid();
            Guid courseId = Guid.NewGuid();
            Guid chapterId = Guid.NewGuid();

            DbContext.Categories.Add(new Category(categoryId, "Category", "Description", true));
            DbContext.Courses.Add(new Course(courseId, "Course", "Description", 10m, "image.png", true, categoryId, UserId));
            DbContext.Chapters.Add(new Chapter(chapterId, courseId, "Chapter", "1"));
            DbContext.Lessons.Add(new Lesson(LessonId, chapterId, courseId, "Lesson", LessonType.Reading, "1"));
            DbContext.SaveChanges();
        }
    }
}