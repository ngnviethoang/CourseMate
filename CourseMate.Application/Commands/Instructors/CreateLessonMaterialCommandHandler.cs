using CourseMate.Application.BackgroundJobs;
using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Instructors;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Contracts.Options;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Hangfire;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.Commands.Instructors;

internal sealed class CreateLessonMaterialCommandHandler : AbstractCommandHandler<CreateLessonMaterialCommand, ProcessingStatusDto>
{
    private readonly IEnumerable<string> _allowedImageExtensions = [".doc", ".docx", ".pdf"];
    private readonly StorageOptions _storageOptions;

    public CreateLessonMaterialCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor, IOptions<StorageOptions> storageOptions) : base(dbContext, httpContextAccessor)
    {
        _storageOptions = storageOptions.Value;
    }

    public override async Task<ProcessingStatusDto> Handle(CreateLessonMaterialCommand request, CancellationToken cancellationToken)
    {
        string fileExtension = Path.GetExtension(request.FileName);
        if (!_allowedImageExtensions.Contains(fileExtension, StringComparer.OrdinalIgnoreCase))
        {
            throw new BusinessException(ErrorMessages.InvalidFileType);
        }

        Guid userId = GetCurrentUserId();
        string documentsDir = Path.Combine(_storageOptions.DocumentsPath, userId.ToString());
        if (!Directory.Exists(documentsDir))
        {
            Directory.CreateDirectory(documentsDir);
        }

        Guid fileEntryId = Guid.NewGuid();
        string fileName = $"{fileEntryId}{fileExtension}";
        string filePath = Path.Combine(documentsDir, fileName);

        await using FileStream stream = new(filePath, FileMode.CreateNew, FileAccess.Write, FileShare.None);
        await stream.WriteAsync(request.Content, cancellationToken);

        FileEntry fileEntry = new(fileEntryId,
            fileName,
            request.Content.LongLength,
            filePath,
            string.Empty,
            FileStatus.Processing,
            0,
            0, DateTimeOffset.UtcNow,
            FileType.Document);

        DbContext.FileEntries.Add(fileEntry);

        string embeddingJobId = BackgroundJob.Enqueue<ProcessFileEmbeddingJob>(job => job.ExecuteAsync(fileEntryId, cancellationToken));
        BackgroundJob.ContinueJobWith<GenerateOutlineJob>(embeddingJobId, job => job.ExecuteAsync(request.LessonId, fileEntryId, cancellationToken));

        return new ProcessingStatusDto
        {
            LessonMaterialId = fileEntryId,
            LessonId = request.LessonId,
            Status = ProcessingStatus.Processing
        };
    }
}