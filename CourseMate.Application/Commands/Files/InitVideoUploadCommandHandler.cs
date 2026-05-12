using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Options;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.Commands.Files;

public class InitVideoUploadCommand : IRequest<InitVideoUploadResponse>;

internal sealed class InitVideoUploadCommandHandler : AbstractCommandHandler<InitVideoUploadCommand, InitVideoUploadResponse>
{
    private readonly StorageOptions _storageOptions;

    public InitVideoUploadCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor,
        IOptions<StorageOptions> storageOptions) : base(dbContext, httpContextAccessor)
    {
        _storageOptions = storageOptions.Value;
    }

    public override async Task<InitVideoUploadResponse> Handle(InitVideoUploadCommand request, CancellationToken ct)
    {
        Guid userId = CurrentUserId;
        string userDir = Path.Combine(_storageOptions.RootPath, userId.ToString());
        Util.CreateDirectoryIfNotExist(userDir);
        Guid fileId = Guid.NewGuid();
        string fileName = $"{fileId}.mp4";
        string fileLocation = Path.Combine(userDir, fileId.ToString());
        FileEntry fileEntry = new(
            fileId,
            fileName,
            0,
            fileLocation.Replace(_storageOptions.RootPath, string.Empty),
            FileStatus.Uploading,
            0,
            0,
            null,
            FileType.Video);

        await DbContext.FileEntries.AddAsync(fileEntry, ct);

        return new InitVideoUploadResponse
        {
            FileId = fileId
        };
    }
}