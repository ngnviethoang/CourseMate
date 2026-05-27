using CourseMate.Application.Events;
using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Contracts.Options;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.Commands.Courses;

public class CreateLessonMaterialCommand : IRequest<ProcessingStatusDto>
{
    public Guid LessonId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public byte[] Content { get; set; } = [];
}

public sealed class CreateLessonMaterialCommandHandler : AbstractCommandHandler<CreateLessonMaterialCommand, ProcessingStatusDto>
{
    private readonly IEnumerable<string> _allowedImageExtensions = [".doc", ".docx"];
    private readonly IMediator _mediator;
    private readonly StorageOptions _storageOptions;

    public CreateLessonMaterialCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor, IOptions<StorageOptions> storageOptions, IMediator mediator) : base(dbContext, httpContextAccessor)
    {
        _mediator = mediator;
        _storageOptions = storageOptions.Value;
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
        string userDir = Path.Combine(_storageOptions.RootPath, userId.ToString());
        Util.CreateDirectoryIfNotExist(userDir);
        Guid fileEntryId = Guid.NewGuid();
        string fileName = $"{fileEntryId}{fileExtension}";
        string filePath = Path.Combine(userDir, fileName);
        await using FileStream stream = new(filePath, FileMode.CreateNew, FileAccess.Write, FileShare.None);
        await stream.WriteAsync(request.Content, ct);

        FileEntry fileEntry = new(fileEntryId,
            fileName,
            request.Content.LongLength,
            filePath.Replace(_storageOptions.RootPath, string.Empty),
            FileStatus.Processing,
            0,
            0, DateTimeOffset.UtcNow,
            FileType.Document);

        DbContext.FileEntries.Add(fileEntry);
        LessonMaterial material = new(Guid.NewGuid(), request.LessonId, fileEntry.Id, LessonMaterialState.GeneratingEmbedding, string.Empty);
        DbContext.LessonMaterials.Add(material);
        await _mediator.Publish(new LessonMaterialCreatedEvent(material.Id, fileEntryId, material.LessonId), ct);
        return new ProcessingStatusDto
        {
            LessonMaterialId = fileEntryId,
            LessonId = request.LessonId
        };
    }
}