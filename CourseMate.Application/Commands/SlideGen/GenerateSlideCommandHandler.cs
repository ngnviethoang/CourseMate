using CourseMate.Application.BackgroundJobs;
using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Instructors;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Hangfire;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.SlideGen;

internal sealed class GenerateSlideCommandHandler : AbstractCommandHandler<GenerateSlideCommand, ProcessingStatusDto>
{
    private readonly IBackgroundJobClient _backgroundJobClient;

    public GenerateSlideCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor,
        IBackgroundJobClient backgroundJobClient)
        : base(dbContext, httpContextAccessor)
    {
        _backgroundJobClient = backgroundJobClient;
    }

    public override async Task<ProcessingStatusDto> Handle(GenerateSlideCommand request,
        CancellationToken cancellationToken)
    {
        LessonMaterial material = await DbContext.LessonMaterials
                                      .FirstOrDefaultAsync(m => m.LessonId == request.LessonId
                                                                && m.Outline != null, cancellationToken)
                                  ?? throw new KeyNotFoundException($"No material with outline found for lesson {request.LessonId}");

        // Reset slide state
        material.SlideFilePath = string.Empty;
        await DbContext.SaveChangesAsync(cancellationToken);

        // Enqueue slide generation job
        string jobId = _backgroundJobClient.Enqueue<GenerateSlideJob>(job => job.ExecuteAsync(material.Id, CancellationToken.None));
        material.HangfireJobId = jobId;
        await DbContext.SaveChangesAsync(cancellationToken);

        return new ProcessingStatusDto
        {
            LessonMaterialId = material.Id,
            LessonId = request.LessonId,
            Status = material.Status
        };
    }
}