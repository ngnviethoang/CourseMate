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
        Guid uploadId = Guid.NewGuid();
        string tempDir = Path.Combine(_storageOptions.TempPath, uploadId.ToString());
        Directory.CreateDirectory(tempDir);

        FileEntry fileEntry = new(
            uploadId,
            request.FileName,
            request.ContentType,
            request.FileSize,
            string.Empty,
            tempDir,
            FileStatus.Uploading,
            0,
            0,
            null,
            FileType.Video,
            string.Empty);

        await DbContext.FileEntries.AddAsync(fileEntry, cancellationToken);
        await DbContext.SaveChangesAsync(cancellationToken);


        if (_storageOptions.MaxSizeTrunkFile <= 0)
        {
            throw new BusinessException(string.Format(ErrorMessages.InvalidConfiguration, "MaxSizeTrunkFile"));
        }

        long maxTotalChunks = request.FileSize / _storageOptions.MaxSizeTrunkFile;

        return new InitVideoUploadResponse
        {
            UploadId = uploadId,
            MaxTotalTrunks = Math.Abs(maxTotalChunks)
        };
    }
}