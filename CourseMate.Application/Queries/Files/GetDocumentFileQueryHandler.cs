using CourseMate.Application.Shared;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Files;

public class GetDocumentFileQuery : IRequest<DocumentFileResponse?>
{
    public Guid FileId { get; set; }
}

public class DocumentFileResponse
{
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public byte[] Content { get; set; } = [];
}

internal sealed class GetDocumentFileQueryHandler : AbstractQueryHandler<GetDocumentFileQuery, DocumentFileResponse?>
{
    public GetDocumentFileQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<DocumentFileResponse?> Handle(GetDocumentFileQuery request, CancellationToken ct)
    {
        FileEntry? fileEntry = await DbContext.FileEntries.FirstOrDefaultAsync(x => x.Id == request.FileId, ct);
        if (fileEntry == null || !File.Exists(fileEntry.FilePath))
        {
            return null;
        }

        byte[] content = await File.ReadAllBytesAsync(fileEntry.FilePath, ct);
        string contentType = GetContentType(fileEntry.FileName);

        return new DocumentFileResponse
        {
            FileName = fileEntry.FileName,
            ContentType = contentType,
            Content = content
        };
    }

    private string GetContentType(string fileName)
    {
        string extension = Path.GetExtension(fileName).ToLower();
        return extension switch
        {
            ".pdf" => "application/pdf",
            ".pptx" => "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            ".ppt" => "application/vnd.ms-powerpoint",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".doc" => "application/msword",
            ".txt" => "text/plain",
            _ => "application/octet-stream"
        };
    }
}