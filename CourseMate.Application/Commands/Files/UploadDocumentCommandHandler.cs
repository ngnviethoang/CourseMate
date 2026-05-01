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

public class UploadDocumentCommand : IRequest<UploadDocumentResponse>
{
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public byte[] Content { get; set; } = [];
}

public class UploadDocumentResponse
{
    public Guid FileId { get; set; }
    public string FileUrl { get; set; } = string.Empty;
}

internal sealed class UploadDocumentCommandHandler : AbstractCommandHandler<UploadDocumentCommand, UploadDocumentResponse>
{
    private readonly IEnumerable<string> _allowedDocumentExtensions = [".pdf", ".pptx", ".ppt", ".docx", ".doc", ".txt"];
    private readonly StorageOptions _storageOptions;

    public UploadDocumentCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor,
        IOptions<StorageOptions> storageOptions)
        : base(dbContext, httpContextAccessor)
    {
        _storageOptions = storageOptions.Value;
    }

    public override async Task<UploadDocumentResponse> Handle(UploadDocumentCommand request, CancellationToken ct)
    {
        string extension = Path.GetExtension(request.FileName).ToLower();
        if (!_allowedDocumentExtensions.Contains(extension))
        {
            throw new BusinessException(ErrorMessages.InvalidFileType);
        }

        Guid userId = CurrentUserId;
        string userDir = Path.Combine(_storageOptions.DocumentsPath, userId.ToString());
        if (!Directory.Exists(userDir))
        {
            Directory.CreateDirectory(userDir);
        }

        Guid fileId = Guid.NewGuid();
        string fileName = $"{fileId}{extension}";
        string filePath = Path.Combine(userDir, fileName);
        await File.WriteAllBytesAsync(filePath, request.Content, ct);

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
            FileType.Document);

        await DbContext.FileEntries.AddAsync(fileEntry, ct);
        await DbContext.SaveChangesAsync(ct);

        HttpRequest? httpRequest = HttpContextAccessor.HttpContext!.Request;
        string fileUrl = $"{httpRequest.Scheme}://{httpRequest.Host}/api/files/documents/{fileId}";
        return new UploadDocumentResponse
        {
            FileId = fileId,
            FileUrl = fileUrl
        };
    }
}
