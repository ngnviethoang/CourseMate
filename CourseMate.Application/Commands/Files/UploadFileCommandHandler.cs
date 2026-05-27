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

public class UploadFileCommand : IRequest<FileUploadResponse>
{
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public byte[] Content { get; set; } = [];
}

public sealed class UploadFileCommandHandler : AbstractCommandHandler<UploadFileCommand, FileUploadResponse>
{
    private static readonly IReadOnlyDictionary<FileType, HashSet<string>> AllowedExtensions = new Dictionary<FileType, HashSet<string>>
    {
        [FileType.Image] = [".jpg", ".jpeg", ".png"],
        [FileType.Document] = [".pdf", ".pptx", ".ppt", ".docx", ".doc", ".txt", ".md"]
    };

    private readonly StorageOptions _storageOptions;

    public UploadFileCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor,
        IOptions<StorageOptions> storageOptions)
        : base(dbContext, httpContextAccessor)
    {
        _storageOptions = storageOptions.Value;
    }

    public override async Task<FileUploadResponse> Handle(
        UploadFileCommand request,
        CancellationToken ct)
    {
        string extension = GetValidExtension(request.FileName);
        FileType fileType = GetFileType(extension);

        Directory.CreateDirectory(_storageOptions.PublicPath);

        Guid fileId = Guid.NewGuid();
        string fileName = $"{fileId}{extension}";
        string physicalPath = Path.Combine(_storageOptions.PublicPath, fileName);
        await File.WriteAllBytesAsync(physicalPath, request.Content, ct);
        FileEntry fileEntry = new(
            fileId,
            fileName,
            request.Content.Length,
            physicalPath.Replace(_storageOptions.RootPath, string.Empty),
            FileStatus.Completed,
            1,
            1,
            DateTimeOffset.UtcNow,
            fileType);

        await DbContext.FileEntries.AddAsync(fileEntry, ct);

        return new FileUploadResponse
        {
            FileId = fileId,
            FileUrl = BuildFileUrl(fileName)
        };
    }

    private static string GetValidExtension(string fileName)
    {
        string extension = Path.GetExtension(fileName).ToLowerInvariant();

        if (string.IsNullOrWhiteSpace(extension))
        {
            throw new BusinessException(ErrorCode.InvalidFileType, "Invalid file type. This file type is not allowed.");
        }

        bool isAllowed = AllowedExtensions.Values.Any(x => x.Contains(extension));

        if (!isAllowed)
        {
            throw new BusinessException(ErrorCode.InvalidFileType, "Invalid file type. This file type is not allowed.");
        }

        return extension;
    }

    private static FileType GetFileType(string extension)
    {
        foreach (KeyValuePair<FileType, HashSet<string>> item in AllowedExtensions)
        {
            if (item.Value.Contains(extension))
            {
                return item.Key;
            }
        }

        throw new BusinessException(ErrorCode.InvalidFileType, "Invalid file type. This file type is not allowed.");
    }

    private string BuildFileUrl(string storedFileName)
    {
        HttpRequest request = HttpContextAccessor.HttpContext!.Request;
        string requestPath = _storageOptions.StaticRequestPath.TrimEnd('/');
        return $"{request.Scheme}://{request.Host}{requestPath}/{storedFileName}";
    }
}