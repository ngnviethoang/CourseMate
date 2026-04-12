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

namespace CourseMate.Application.Commands.Files;

public class UploadImageCommand : IRequest<UploadImageResponse>
{
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public byte[] Content { get; set; } = [];
}

internal sealed class UploadImageCommandHandler : AbstractCommandHandler<UploadImageCommand, UploadImageResponse>
{
    private readonly IEnumerable<string> _allowedImageExtensions = [".jpg", ".jpeg", ".png"];
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
        if (!_allowedImageExtensions.Contains(Path.GetExtension(request.FileName), StringComparer.OrdinalIgnoreCase))
        {
            throw new BusinessException(ErrorMessages.InvalidFileType);
        }

        Guid userId = CurrentUserId;
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
            fileName,
            request.Content.Length,
            filePath,
            string.Empty,
            FileStatus.Completed,
            1,
            1,
            DateTimeOffset.UtcNow,
            FileType.Image);

        await DbContext.FileEntries.AddAsync(fileEntry, cancellationToken);

        HttpRequest? httpRequest = HttpContextAccessor.HttpContext!.Request;
        string fileUrl = $"{httpRequest.Scheme}://{httpRequest.Host}/api/files/images/{fileId}";
        return new UploadImageResponse
        {
            FileId = fileId,
            FileUrl = fileUrl
        };
    }
}