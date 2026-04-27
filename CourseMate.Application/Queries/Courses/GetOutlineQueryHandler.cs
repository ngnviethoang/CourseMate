using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace CourseMate.Application.Queries.Courses;

public class GetOutlineQuery : IRequest<OutlineDto?>
{
    public Guid LessonId { get; set; }
    public Guid LessonMaterialId { get; set; }
}

internal sealed class GetOutlineQueryHandler : AbstractQueryHandler<GetOutlineQuery, OutlineDto?>
{
    private readonly ILogger<GetOutlineQueryHandler> _logger;

    public GetOutlineQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor, ILogger<GetOutlineQueryHandler> logger)
        : base(dbContext, httpContextAccessor)
    {
        _logger = logger;
    }

    public override async Task<OutlineDto?> Handle(GetOutlineQuery request, CancellationToken ct)
    {
        bool isAuthor = await (
                from lesson in DbContext.Lessons
                join course in DbContext.Courses
                    on lesson.CourseId equals course.Id
                where lesson.Id == request.LessonId
                select course.InstructorId
            )
            .WhereIf(IsInRole(Roles.Instructor), x => x == CurrentUserId)
            .AnyAsync(ct);

        if (!isAuthor)
        {
            throw new UnauthorizedAccessException();
        }

        LessonMaterial? lessonMaterial = await DbContext.LessonMaterials.FirstOrDefaultAsync(i => i.Id == request.LessonMaterialId, ct);
        if (lessonMaterial == null)
        {
            return new OutlineDto();
        }

        LectureOutline? parsedOutline = null;
        try
        {
            parsedOutline = JsonConvert.DeserializeObject<LectureOutline>(lessonMaterial.Outline);
            bool isValid = parsedOutline != null && !string.IsNullOrWhiteSpace(parsedOutline.LessonTitle) && parsedOutline?.Slides != null && parsedOutline.Slides.Any();
            if (!isValid)
            {
                _logger.LogWarning("Invalid AI outline structure for lesson {LessonId}. Raw output: {Outline}", lessonMaterial.LessonId, lessonMaterial.Outline);
            }
        }
        catch (JsonException ex)
        {
            _logger.LogWarning(ex, "Failed to parse AI outline for lesson {LessonId}. Raw output: {Outline}", lessonMaterial.LessonId, lessonMaterial.Outline);
        }

        return new OutlineDto
        {
            LessonId = request.LessonId,
            LessonMaterialId = request.LessonMaterialId,
            LectureOutline = parsedOutline ?? new LectureOutline()
        };
    }
}