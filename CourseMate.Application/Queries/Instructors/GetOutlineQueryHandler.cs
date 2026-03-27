using System.Text.Json;
using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Instructors;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Instructors;

internal sealed class GetOutlineQueryHandler : AbstractQueryHandler<GetOutlineQuery, OutlineDto?>
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public GetOutlineQueryHandler(
        CourseMateReadOnlyDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<OutlineDto?> Handle(GetOutlineQuery request, CancellationToken cancellationToken)
    {
        Lesson? lesson = await DbContext.Lessons.FirstOrDefaultAsync(l => l.Id == request.LessonId, cancellationToken);
        if (lesson == null)
        {
            return null;
        }

        LessonMaterial? material = await DbContext.LessonMaterials
            .OrderByDescending(m => m.CreationTime)
            .FirstOrDefaultAsync(m => m.LessonId == request.LessonId, cancellationToken);

        if (material == null)
        {
            return null;
        }

        List<OutlineSectionDto> sections = [];
        if (!string.IsNullOrWhiteSpace(material.Outline))
        {
            sections = JsonSerializer.Deserialize<List<OutlineSectionDto>>(material.Outline, JsonOptions) ?? [];
        }

        return new OutlineDto
        {
            LessonId = request.LessonId,
            MaterialId = material.Id,
            LessonTitle = lesson.Title,
            Sections = sections
        };
    }
}