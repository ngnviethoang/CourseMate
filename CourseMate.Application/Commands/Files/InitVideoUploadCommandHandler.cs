using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Files;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Contracts.Options;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.Commands.Files;

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

    public override async Task<InitVideoUploadResponse> Handle(InitVideoUploadCommand request, CancellationToken cancellationToken)
    {
        if (!".mp4".Equals(Path.GetExtension(request.FileName)))
        {
            throw new BusinessException(ErrorMessages.InvalidFileType);
        }

        if (_storageOptions.MaxSizeFileVideo <= 0)
        {
            throw new ArgumentException(string.Format(ErrorMessages.InvalidConfiguration, nameof(StorageOptions.MaxSizeFileVideo)));
        }

        if (_storageOptions.MaxSizeTrunkFile <= 0)
        {
            throw new ArgumentException(string.Format(ErrorMessages.InvalidConfiguration, nameof(StorageOptions.MaxSizeTrunkFile)));
        }

        int maxTotalChunks = (int)Math.Ceiling(request.FileSize / _storageOptions.MaxSizeTrunkFile + 1);

        Guid fileId = Guid.NewGuid();
        string tempDir = Path.Combine(_storageOptions.TempPath, fileId.ToString());
        Directory.CreateDirectory(tempDir);

        FileEntry fileEntry = new(
            fileId,
            request.FileName,
            "video/mp4",
            request.FileSize,
            string.Empty,
            tempDir,
            FileStatus.Uploading,
            maxTotalChunks,
            0,
            null,
            FileType.Video);

        await DbContext.FileEntries.AddAsync(fileEntry, cancellationToken);
        await DbContext.SaveChangesAsync(cancellationToken);

        return new InitVideoUploadResponse
        {
            FileId = fileId,
            MaxTotalTrunks = maxTotalChunks
        };
    }
}