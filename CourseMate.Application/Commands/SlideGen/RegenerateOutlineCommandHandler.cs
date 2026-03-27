using CourseMate.Application.BackgroundJobs;
using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Instructors;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Hangfire;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.SlideGen;

internal sealed class RegenerateOutlineCommandHandler : AbstractCommandHandler<RegenerateOutlineCommand, ProcessingStatusDto>
{
    public RegenerateOutlineCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ProcessingStatusDto> Handle(RegenerateOutlineCommand request,
        CancellationToken cancellationToken)
    {
        LessonMaterial? material = await DbContext.LessonMaterials
            .Where(m => string.IsNullOrWhiteSpace(m.ParsedContent))
            .FirstOrDefaultAsync(m => m.LessonId == request.LessonId, cancellationToken);

        material.Outline = string.Empty;
        material.Status = DocumentProcessingStatus.Parsed;
        await DbContext.SaveChangesAsync(cancellationToken);

        string jobId = BackgroundJob.Enqueue<GenerateOutlineJob>(job => job.ExecuteAsync(material.Id, CancellationToken.None));
        material.HangfireJobId = jobId;
        await DbContext.SaveChangesAsync(cancellationToken);

        return new ProcessingStatusDto
        {
            LessonMaterialId = material.Id,
            LessonId = request.LessonId,
            Status = DocumentProcessingStatus.Parsed
        };
    }
}