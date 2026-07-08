using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Options;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace CourseMate.Application.Queries.Files;

public class GetFileByIdQuery : IRequest<FileContentResponse?>
{
    public Guid FileId { get; set; }
}

internal sealed class GetFileByIdQueryHandler : AbstractQueryHandler<GetFileByIdQuery, FileContentResponse?>
{
    private readonly StorageOptions _storageOptions;

    public GetFileByIdQueryHandler(
        IOptions<StorageOptions> storageOptions,
        CourseMateReadOnlyDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
        _storageOptions = storageOptions.Value;
    }

    public override async Task<FileContentResponse?> Handle(GetFileByIdQuery request, CancellationToken ct)
    {
        FileEntry? fileEntry = await DbContext.FileEntries.FirstOrDefaultAsync(f => f.Id == request.FileId && f.Status == FileStatus.Completed, ct);

        if (fileEntry == null)
        {
            return null;
        }

        string physicalPath = Path.Combine(_storageOptions.RootPath, fileEntry.FileLocation);
        if (!File.Exists(physicalPath))
        {
            return null;
        }

        byte[] content = await File.ReadAllBytesAsync(physicalPath, ct);
        return new FileContentResponse
        {
            FileName = fileEntry.FileName,
            Content = content
        };
    }
}
