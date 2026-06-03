using CourseMate.Application.Services.FileStorageServices;
using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace CourseMate.Application.Commands.Lessons;

public class CreateLessonMaterialCommand : IRequest<ProcessingStatusDto>
{
    public Guid LessonId { get; set; }
    public string FileName { get; set; } = string.Empty;

    [JsonIgnore]
    public byte[] Content { get; set; } = [];

    public LessonMaterialPromptType PromptType { get; set; } = LessonMaterialPromptType.BulletSlide;
}

public sealed class CreateLessonMaterialCommandHandler : AbstractCommandHandler<CreateLessonMaterialCommand, ProcessingStatusDto>
{
    private readonly IEnumerable<string> _allowedImageExtensions = [".doc", ".docx"];
    private readonly IFileStorageManager _fileStorageManager;
    private readonly IMediator _mediator;

    public CreateLessonMaterialCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor, IFileStorageManager fileStorageManager, IMediator mediator) : base(dbContext, httpContextAccessor)
    {
        _fileStorageManager = fileStorageManager;
        _mediator = mediator;
    }

    public override async Task<ProcessingStatusDto> Handle(CreateLessonMaterialCommand request, CancellationToken ct)
    {
        string fileExtension = Path.GetExtension(request.FileName);
        if (!_allowedImageExtensions.Contains(fileExtension, StringComparer.OrdinalIgnoreCase))
        {
            throw new BusinessException(ErrorCode.InvalidFileType, "Invalid file type. This file type is not allowed.");
        }

        await EnsureAuthorCourseAsync(request.LessonId, ct);
        Guid userId = CurrentUserId;
        Guid fileEntryId = Guid.NewGuid();
        string fileName = $"{fileEntryId}{fileExtension}";
        FileEntry fileEntry = new(fileEntryId,
            fileName,
            request.Content.LongLength,
            Path.Combine(userId.ToString(), fileName),
            FileStatus.Processing,
            0,
            0, DateTimeOffset.UtcNow,
            FileType.Document);
        await using MemoryStream stream = new(request.Content);
        await _fileStorageManager.CreateAsync(StorageFileEntry.FromFileEntry(fileEntry), stream, ct);

        DbContext.FileEntries.Add(fileEntry);
        LessonMaterial lessonMaterial = new(Guid.NewGuid(), request.LessonId, fileEntry.Id, LessonMaterialState.GeneratingEmbedding, string.Empty);
        DbContext.LessonMaterials.Add(lessonMaterial);
        return new ProcessingStatusDto
        {
            LessonMaterialId = lessonMaterial.Id,
            LessonId = request.LessonId
        };
    }
}