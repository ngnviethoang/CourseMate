using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Files;
using CourseMate.Contracts.Enums;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Files;

internal sealed class GetVideoFilePathQueryHandler : AbstractQueryHandler<GetVideoFilePathQuery, VideoFilePathDto?>
{
    public GetVideoFilePathQueryHandler(
        CourseMateReadOnlyDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<VideoFilePathDto?> Handle(GetVideoFilePathQuery request, CancellationToken cancellationToken)
    {
        FileEntry? fileEntry = await DbContext.FileEntries
            .Where(f => f.Status == FileStatus.Completed)
            .Where(f => f.FileType == FileType.Video)
            .FirstOrDefaultAsync(f => f.Id == request.FileId, cancellationToken);

        if (fileEntry == null)
        {
            return null;
        }

        return new VideoFilePathDto
        {
            FilePath = fileEntry.FilePath,
            FileName = fileEntry.FileName
        };
    }
}