using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Instructors;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Instructors;

internal sealed class GetProcessingStatusQueryHandler : AbstractQueryHandler<GetProcessingStatusQuery, ProcessingStatusDto>
{
    public GetProcessingStatusQueryHandler(
        CourseMateReadOnlyDbContext dbContext,
        IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ProcessingStatusDto> Handle(GetProcessingStatusQuery request,
        CancellationToken cancellationToken)
    {
        LessonMaterial material = await DbContext.LessonMaterials
                                      .OrderByDescending(m => m.CreationTime)
                                      .FirstOrDefaultAsync(m => m.LessonId == request.LessonId, cancellationToken)
                                  ?? throw new KeyNotFoundException($"No material found for lesson {request.LessonId}");

        return new ProcessingStatusDto
        {
            LessonMaterialId = material.Id,
            LessonId = material.LessonId,
            Status = material.Status
        };
    }
}