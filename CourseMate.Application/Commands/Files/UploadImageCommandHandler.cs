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

public class UploadImageCommand : IRequest<FileUploadResponse>
{
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public byte[] Content { get; set; } = [];
}

internal sealed class UploadImageCommandHandler : AbstractCommandHandler<UploadImageCommand, FileUploadResponse>
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

    public override async Task<FileUploadResponse> Handle(UploadImageCommand request, CancellationToken ct)
    {
        if (!_allowedImageExtensions.Contains(Path.GetExtension(request.FileName), StringComparer.OrdinalIgnoreCase))
        {
            throw new BusinessException(ErrorMessages.InvalidFileType);
        }

        Util.CreateDirectoryIfNotExist(_storageOptions.PublicPath);
        Guid fileId = Guid.NewGuid();
        string fileName = $"{fileId}{Path.GetExtension(request.FileName)}";
        string filePath = Path.Combine(_storageOptions.PublicPath, fileName);
        await File.WriteAllBytesAsync(filePath, request.Content, ct);
        FileEntry fileEntry = new(
            fileId,
            fileName,
            request.Content.Length,
            filePath.Replace(_storageOptions.RootPath, string.Empty),
            string.Empty,
            FileStatus.Completed,
            1,
            1,
            DateTimeOffset.UtcNow,
            FileType.Image);
        await DbContext.FileEntries.AddAsync(fileEntry, ct);
        HttpRequest? httpRequest = HttpContextAccessor.HttpContext!.Request;
        string fileUrl = $"{httpRequest.Scheme}://{httpRequest.Host}{_storageOptions.StaticRequestPath}/{filePath}";
        return new FileUploadResponse
        {
            FileId = fileId,
            FileUrl = fileUrl
        };
    }
}