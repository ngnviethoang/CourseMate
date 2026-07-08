using CourseMate.Application.Services.FileStorageServices;
using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Files;

public class GetFileByIdQuery : IRequest<FileContentResponse?>
{
    public Guid FileId { get; set; }
}

public sealed class GetFileByIdQueryHandler : AbstractQueryHandler<GetFileByIdQuery, FileContentResponse?>
{
    private readonly IFileStorageManager _fileStorageManager;

    public GetFileByIdQueryHandler(
        IFileStorageManager fileStorageManager,
        CourseMateReadOnlyDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
        _fileStorageManager = fileStorageManager;
    }

    public override async Task<FileContentResponse?> Handle(GetFileByIdQuery request, CancellationToken ct)
    {
        FileEntry? fileEntry = await DbContext.FileEntries.FirstOrDefaultAsync(f => f.Id == request.FileId && f.Status == FileStatus.Completed, ct);

        if (fileEntry == null)
        {
            return null;
        }

        StorageFileEntry storageFileEntry = StorageFileEntry.FromFileEntry(fileEntry);
        if (!await _fileStorageManager.ExistsAsync(storageFileEntry, ct))
        {
            return null;
        }

        byte[] content = await _fileStorageManager.ReadBytesAsync(storageFileEntry, ct);
        return new FileContentResponse
        {
            FileName = fileEntry.FileName,
            Content = content
        };
    }
}
