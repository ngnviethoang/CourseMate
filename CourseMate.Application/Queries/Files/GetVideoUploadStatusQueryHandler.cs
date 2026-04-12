using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Files;

public class GetVideoUploadStatusQuery : IRequest<VideoUploadStatusDto?>
{
    public Guid FileId { get; set; }
}

internal sealed class GetVideoUploadStatusQueryHandler : AbstractQueryHandler<GetVideoUploadStatusQuery, VideoUploadStatusDto?>
{
    public GetVideoUploadStatusQueryHandler(
        CourseMateReadOnlyDbContext dbContext,
        IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<VideoUploadStatusDto?> Handle(GetVideoUploadStatusQuery request, CancellationToken cancellationToken)
    {
        Guid userId = GetCurrentUserId();
        FileEntry? fileEntry = await DbContext.FileEntries
            .Where(f => f.UserId == userId)
            .FirstOrDefaultAsync(f => f.Id == request.FileId, cancellationToken);
        if (fileEntry == null)
        {
            return null;
        }

        int progress;

        if (fileEntry.Status == FileStatus.Completed || fileEntry.Status == FileStatus.Processing)
        {
            progress = 100;
        }
        else if (fileEntry.Status == FileStatus.Uploading && fileEntry.TotalChunks > 0)
        {
            progress = (int)Math.Round((double)fileEntry.UploadedChunks / fileEntry.TotalChunks * 100);
            progress = Math.Max(0, Math.Min(100, progress));
        }
        else
        {
            progress = 0;
        }

        return new VideoUploadStatusDto
        {
            UploadId = fileEntry.Id,
            Status = fileEntry.Status,
            Progress = progress,
            CreatedAt = fileEntry.CreationTime.DateTime,
            CompletedAt = fileEntry.CompletedAt?.DateTime
        };
    }
}