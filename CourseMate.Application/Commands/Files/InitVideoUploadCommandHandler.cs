using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Files;

public class InitVideoUploadCommand : IRequest<InitVideoUploadResponse>;

public sealed class InitVideoUploadCommandHandler : AbstractCommandHandler<InitVideoUploadCommand, InitVideoUploadResponse>
{
    public InitVideoUploadCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<InitVideoUploadResponse> Handle(InitVideoUploadCommand request, CancellationToken ct)
    {
        Guid userId = CurrentUserId;
        Guid fileId = Guid.NewGuid();
        string fileName = $"{fileId}.mp4";
        string fileLocation = Path.Combine(userId.ToString(), fileName);
        FileEntry fileEntry = new(
            fileId,
            fileName,
            0,
            fileLocation,
            FileStatus.Uploading,
            0,
            0,
            null,
            FileType.Video);

        await DbContext.FileEntries.AddAsync(fileEntry, ct);

        return new InitVideoUploadResponse
        {
            FileId = fileId
        };
    }
}