using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Files;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Files;

internal sealed class GetImageFileQueryHandler : AbstractQueryHandler<GetImageFileQuery, ImageFileResponse?>
{
    public GetImageFileQueryHandler(
        CourseMateReadOnlyDbContext dbContext,
        IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ImageFileResponse?> Handle(GetImageFileQuery request, CancellationToken cancellationToken)
    {
        FileEntry? fileEntry = await DbContext.FileEntries.FirstOrDefaultAsync(f => f.Id == request.FileId && f.FileType == FileType.Image, cancellationToken);

        if (fileEntry == null)
        {
            return null;
        }

        if (!File.Exists(fileEntry.FilePath))
        {
            return null;
        }

        byte[] fileData = await File.ReadAllBytesAsync(fileEntry.FilePath, cancellationToken);

        return new ImageFileResponse
        {
            FileName = fileEntry.FileName,
            ContentType = fileEntry.ContentType,
            Content = fileData
        };
    }
}