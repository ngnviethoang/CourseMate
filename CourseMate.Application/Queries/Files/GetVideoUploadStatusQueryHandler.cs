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

public sealed class GetVideoUploadStatusQueryHandler : AbstractQueryHandler<GetVideoUploadStatusQuery, VideoUploadStatusDto?>
{
    public GetVideoUploadStatusQueryHandler(
        CourseMateReadOnlyDbContext dbContext,
        IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<VideoUploadStatusDto?> Handle(GetVideoUploadStatusQuery request, CancellationToken ct)
    {
        Guid userId = CurrentUserId;
        FileEntry? fileEntry = await DbContext.FileEntries.FirstOrDefaultAsync(f => f.Id == request.FileId && f.UserId == userId, ct);
        if (fileEntry == null)
        {
            return null;
        }

        int progress;
        if (fileEntry.Status is FileStatus.Completed or FileStatus.Processing)
        {
            progress = 100;
        }
        else if (fileEntry is { Status: FileStatus.Uploading, TotalChunks: > 0 })
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