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

namespace CourseMate.Application.Commands.SlideGen;

internal sealed class UploadMaterialCommandHandler : AbstractCommandHandler<UploadMaterialCommand, ProcessingStatusDto>
{
    private readonly IEnumerable<string> _allowedImageExtensions = [".doc", ".docx", ".pdf"];
    private readonly StorageOptions _storageOptions;

    public UploadMaterialCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor, IOptions<StorageOptions> storageOptions) : base(dbContext, httpContextAccessor)
    {
        _storageOptions = storageOptions.Value;
    }

    public override async Task<ProcessingStatusDto> Handle(UploadMaterialCommand request, CancellationToken cancellationToken)
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

        Guid materialId = Guid.NewGuid();
        string fileName = $"{materialId:N}{fileExtension}";
        string filePath = Path.Combine(documentsDir, fileName);

        await using FileStream stream = new(filePath, FileMode.CreateNew, FileAccess.Write, FileShare.None);
        await stream.WriteAsync(request.Content, cancellationToken);

        string jobId = BackgroundJob.Enqueue<ParseDocumentJob>(job => job.ExecuteAsync(materialId, cancellationToken));
        LessonMaterial material = new(materialId,
            request.LessonId,
            filePath,
            string.Empty,
            string.Empty,
            string.Empty,
            DocumentProcessingStatus.Uploaded,
            jobId);
        DbContext.LessonMaterials.Add(material);

        return new ProcessingStatusDto
        {
            LessonMaterialId = materialId,
            LessonId = request.LessonId,
            Status = DocumentProcessingStatus.Uploaded
        };
    }
}