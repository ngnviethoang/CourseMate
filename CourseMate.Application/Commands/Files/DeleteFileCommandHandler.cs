using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Options;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.Commands.Files;

public class DeleteFileCommand : IRequest<int>
{
    public Guid FileId { get; set; }
}

internal sealed class DeleteFileCommandHandler : AbstractCommandHandler<DeleteFileCommand, int>
{
    private readonly StorageOptions _storageOptions;

    public DeleteFileCommandHandler(
        IOptions<StorageOptions> storageOptions,
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor
    )
        : base(dbContext, httpContextAccessor)
    {
        _storageOptions = storageOptions.Value;
    }

    public override async Task<int> Handle(DeleteFileCommand request, CancellationToken ct)
    {
        Guid userId = CurrentUserId;
        FileEntry? fileEntry = await DbContext.FileEntries.FirstOrDefaultAsync(f => f.Id == request.FileId && f.UserId == userId, ct);

        if (fileEntry == null)
        {
            return Codes.Success;
        }

        List<FileChunk> fileChunks = await DbContext.FileChunks.Where(f => f.FileEntryId == fileEntry.Id).ToListAsync(ct);
        DbContext.FileEntries.Remove(fileEntry);
        DbContext.FileChunks.RemoveRange(fileChunks);

        string filePath = Path.Combine(_storageOptions.RootPath, fileEntry.FilePath);
        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }

        if (string.IsNullOrEmpty(fileEntry.TempDirPath))
        {
            return Codes.Success;
        }

        string tempDirPath = Path.Combine(_storageOptions.RootPath, fileEntry.TempDirPath);
        if (Directory.Exists(tempDirPath))
        {
            Directory.Delete(tempDirPath, true);
        }

        return Codes.Success;
    }
}