using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Shared;
using CourseMate.Contracts;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Contracts.Shared;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Lessons;

public class CreateLessonCommand : IRequest<ResultIdDto>
{
    public Guid ChapterId { get; set; }

    public Guid CourseId { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    [Required]
    public string Title { get; set; } = string.Empty;

    public LessonType LessonType { get; set; }

    [Range(1, int.MaxValue)]
    public int SortOrder { get; set; }
}

public sealed class CreateLessonCommandHandler : AbstractCommandHandler<CreateLessonCommand, ResultIdDto>
{
    public CreateLessonCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(CreateLessonCommand request, CancellationToken ct)
    {
        await DbContext.Courses.EnsureExistsAsync(request.CourseId, ct);
        await DbContext.Chapters.EnsureExistsAsync(request.ChapterId, ct);

        Guid userId = CurrentUserId;
        bool isAdmin = IsInRole(Roles.Admin);
        bool canManageCourse = isAdmin || (IsInRole(Roles.Instructor) && await DbContext.Courses
            .AnyAsync(course => course.Id == request.CourseId && course.InstructorId == userId, ct));
        if (!canManageCourse)
        {
            throw new UnauthorizedAccessException();
        }

        List<string> siblingPositions = await DbContext.Lessons
            .Where(x => x.ChapterId == request.ChapterId && x.CourseId == request.CourseId)
            .OrderBy(x => x.Position)
            .Select(x => x.Position)
            .ToListAsync(ct);

        int maxAllowedSortOrder = siblingPositions.Count + 1;
        if (request.SortOrder < 1 || request.SortOrder > maxAllowedSortOrder)
        {
            throw new BusinessException(ErrorCode.PositionOutOfRange, $"SortOrder must be between 1 and '{maxAllowedSortOrder}'");
        }

        int insertIndex = request.SortOrder - 1;
        string? previous = insertIndex > 0 ? siblingPositions[insertIndex - 1] : null;
        string? next = insertIndex < siblingPositions.Count ? siblingPositions[insertIndex] : null;
        string position = StringFractionalIndexing.GenerateBetween(previous, next);

        Lesson lesson = new(
            Guid.NewGuid(),
            request.ChapterId,
            request.CourseId,
            request.Title,
            request.LessonType,
            position
        );

        await DbContext.AddAsync(lesson, ct);
        return new ResultIdDto { Id = lesson.Id };
    }
}