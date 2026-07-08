using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Files;

public class GetVideoFilePathQuery : IRequest<VideoFilePathDto?>
{
    public Guid FileId { get; set; }
}

internal sealed class GetVideoFilePathQueryHandler : AbstractQueryHandler<GetVideoFilePathQuery, VideoFilePathDto?>
{
    public GetVideoFilePathQueryHandler(
        CourseMateReadOnlyDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
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
            FilePath = fileEntry.FileLocation,
            FileName = fileEntry.FileName
        };
    }
}
