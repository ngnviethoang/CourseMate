using System.Text.Json;
using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Instructors;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.SlideGen;

internal sealed class UpdateOutlineCommandHandler : AbstractCommandHandler<UpdateOutlineCommand, OutlineDto>
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false
    };

    public UpdateOutlineCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<OutlineDto> Handle(UpdateOutlineCommand request, CancellationToken cancellationToken)
    {
        Lesson? lesson = await DbContext.Lessons.FirstOrDefaultAsync(l => l.Id == request.LessonId, cancellationToken);
        if (lesson == null)
        {
            throw new EntityNotFoundException(nameof(Lesson), request.LessonId);
        }

        LessonMaterial? material = await DbContext.LessonMaterials
            .Where(m => m.Status != DocumentProcessingStatus.Failed)
            .FirstOrDefaultAsync(m => m.LessonId == request.LessonId, cancellationToken);

        if (material == null)
        {
            throw new EntityNotFoundException(nameof(LessonMaterial), Guid.Empty);
        }

        material.Outline = JsonSerializer.Serialize(request.Sections, JsonOptions);


        return new OutlineDto
        {
            LessonId = lesson.Id,
            MaterialId = material.Id,
            LessonTitle = lesson.Title ?? string.Empty,
            Sections = request.Sections
        };
    }
}