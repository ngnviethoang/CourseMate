using CourseMate.Application.BackgroundJobs;
using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Hangfire;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Files;

public class CompletedVideoUploadCommand : IRequest<FileUploadResponse>
{
    public Guid FileId { get; set; }
    public int TotalChunks { get; set; }
    public Guid? LessonId { get; set; }
}

public sealed class CompleteVideoUploadCommandHandler : AbstractCommandHandler<CompletedVideoUploadCommand, FileUploadResponse>
{
    public CompleteVideoUploadCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<FileUploadResponse> Handle(CompletedVideoUploadCommand request, CancellationToken ct)
    {
        Guid userId = CurrentUserId;
        FileEntry? fileEntry = await DbContext.FileEntries.FirstOrDefaultAsync(f =>
                f.Id == request.FileId &&
                f.UserId == userId &&
                f.Status == FileStatus.Uploading,
            ct);
        if (fileEntry == null)
        {
            throw new EntityNotFoundException(nameof(FileEntry), request.FileId);
        }

        if (fileEntry.UploadedChunks != request.TotalChunks)
        {
            throw new BusinessException(ErrorCode.UploadIncomplete, $"Upload incomplete. {fileEntry.UploadedChunks}/{request.TotalChunks} chunks uploaded.");
        }

        HttpRequest httpRequest = HttpContextAccessor.HttpContext!.Request;
        string baseUrl = $"{httpRequest.Scheme}://{httpRequest.Host}";
        BackgroundJob.Enqueue<CompleteVideoUploadJob>(job => job.ExecuteAsync(fileEntry.Id, userId, request.LessonId, baseUrl, CancellationToken.None));

        return new FileUploadResponse
        {
            FileId = fileEntry.Id,
            FileUrl = string.Empty
        };
    }
}