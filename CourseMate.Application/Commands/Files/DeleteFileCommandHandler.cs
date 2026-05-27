using CourseMate.Application.Shared;
using CourseMate.Contracts.Options;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.Commands.Files;

public class DeleteFileCommand : IRequest<Unit>
{
    public Guid FileId { get; set; }
}

public sealed class DeleteFileCommandHandler : AbstractCommandHandler<DeleteFileCommand, Unit>
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

    public override async Task<Unit> Handle(DeleteFileCommand request, CancellationToken ct)
    {
        Guid userId = CurrentUserId;
        FileEntry? fileEntry = await DbContext.FileEntries.FirstOrDefaultAsync(f => f.Id == request.FileId && f.UserId == userId, ct);
        if (fileEntry == null)
        {
            return Unit.Value;
        }

        DbContext.FileEntries.Remove(fileEntry);

        string filePath = Path.Combine(_storageOptions.RootPath, fileEntry.FileLocation);
        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }

        List<FileChunk> fileChunks = await DbContext.FileChunks.Where(f => f.FileEntryId == fileEntry.Id).ToListAsync(ct);
        DbContext.FileChunks.RemoveRange(fileChunks);

        foreach (FileChunk fileChunk in fileChunks)
        {
            string chunkPath = Path.Combine(_storageOptions.TempPath, fileChunk.ChunkLocation);
            if (File.Exists(chunkPath))
            {
                File.Delete(chunkPath);
            }
        }

        return Unit.Value;
    }
}