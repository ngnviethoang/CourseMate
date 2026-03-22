using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Files;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Options;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.Commands.Files;

internal sealed class UploadImageCommandHandler : AbstractCommandHandler<UploadImageCommand, UploadImageResponse>
{
    private readonly StorageOptions _storageOptions;

    public UploadImageCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor,
        IOptions<StorageOptions> storageOptions)
        : base(dbContext, httpContextAccessor)
    {
        _storageOptions = storageOptions.Value;
    }

    public override async Task<UploadImageResponse> Handle(UploadImageCommand request, CancellationToken cancellationToken)
    {
        Guid userId = GetCurrentUserId();
        string userDir = Path.Combine(_storageOptions.ImagesPath, userId.ToString());
        if (!Directory.Exists(userDir))
        {
            Directory.CreateDirectory(userDir);
        }

        Guid fileId = Guid.NewGuid();
        string fileName = $"{fileId}{Path.GetExtension(request.FileName)}";
        string filePath = Path.Combine(userDir, fileName);
        await File.WriteAllBytesAsync(filePath, request.Content, cancellationToken);

        FileEntry fileEntry = new(
            fileId,
            request.FileName,
            request.ContentType,
            request.Content.Length,
            filePath,
            string.Empty,
            FileStatus.Completed,
            1,
            1,
            DateTimeOffset.UtcNow,
            FileType.Image,
            string.Empty);

        await DbContext.FileEntries.AddAsync(fileEntry, cancellationToken);
        await DbContext.SaveChangesAsync(cancellationToken);

        HttpRequest? httpRequest = HttpContextAccessor.HttpContext!.Request;
        string fileUrl = $"{httpRequest.Scheme}://{httpRequest.Host}/api/files/images/{fileId}";
        return new UploadImageResponse
        {
            FileId = fileId,
            FileUrl = fileUrl
        };
    }
}