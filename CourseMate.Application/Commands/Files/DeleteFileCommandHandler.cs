using CourseMate.Application.Services.FileStorageServices;
using CourseMate.Application.Shared;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Files;

public class DeleteFileCommand : IRequest<Unit>
{
    public Guid FileId { get; set; }
}

public sealed class DeleteFileCommandHandler : AbstractCommandHandler<DeleteFileCommand, Unit>
{
    private readonly IFileStorageManager _fileStorageManager;

    public DeleteFileCommandHandler(
        IFileStorageManager fileStorageManager,
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor
    )
        : base(dbContext, httpContextAccessor)
    {
        _fileStorageManager = fileStorageManager;
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
        await _fileStorageManager.DeleteAsync(StorageFileEntry.FromFileEntry(fileEntry), ct);

        List<FileChunk> fileChunks = await DbContext.FileChunks.Where(f => f.FileEntryId == fileEntry.Id).ToListAsync(ct);
        DbContext.FileChunks.RemoveRange(fileChunks);

        foreach (FileChunk fileChunk in fileChunks)
        {
            await _fileStorageManager.DeleteAsync(StorageFileEntry.FromFileChunk(fileChunk), ct);
        }

        return Unit.Value;
    }
}