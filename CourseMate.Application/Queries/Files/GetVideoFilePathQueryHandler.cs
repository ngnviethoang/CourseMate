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

public class GetVideoFilePathQuery : IRequest<VideoFilePathDto?>
{
    public Guid FileId { get; set; }
}

public sealed class GetVideoFilePathQueryHandler : AbstractQueryHandler<GetVideoFilePathQuery, VideoFilePathDto?>
{
    private readonly StorageOptions _storageOptions;

    public GetVideoFilePathQueryHandler(
        IOptions<StorageOptions> storageOptions,
        CourseMateReadOnlyDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
        _storageOptions = storageOptions.Value;
    }

    public override async Task<VideoFilePathDto?> Handle(GetVideoFilePathQuery request, CancellationToken ct)
    {
        FileEntry? fileEntry = await DbContext.FileEntries
            .Where(f => f.Status == FileStatus.Completed)
            .Where(f => f.FileType == FileType.Video)
            .FirstOrDefaultAsync(f => f.Id == request.FileId, ct);

        if (fileEntry == null)
        {
            return null;
        }

        return new VideoFilePathDto
        {
            FilePath = Path.Combine(_storageOptions.RootPath, fileEntry.FileLocation),
            FileName = fileEntry.FileName
        };
    }
}
