using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Shared;
using CourseMate.Contracts;
using CourseMate.Contracts.Constants;
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

public class UpdateLessonCommand : IRequest<Unit>
{
    public Guid Id { get; set; }

    public Guid ChapterId { get; set; }

    public Guid CourseId { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    [Required]
    public string Title { get; set; } = string.Empty;

    public LessonType LessonType { get; set; }

    [Range(1, int.MaxValue)]
    public int SortOrder { get; set; }
}

public sealed class UpdateLessonCommandHandler : AbstractCommandHandler<UpdateLessonCommand, Unit>
{
    public UpdateLessonCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<Unit> Handle(UpdateLessonCommand request, CancellationToken ct)
    {
        await DbContext.Courses.EnsureExistsAsync(request.CourseId, ct);
        await DbContext.Chapters.EnsureExistsAsync(request.ChapterId, ct);
        Lesson? lesson = await DbContext.Lessons.FirstOrDefaultAsync(x => x.Id == request.Id, ct);
        if (lesson == null)
        {
            throw new EntityNotFoundException(nameof(Lesson), request.Id);
        }

        Guid userId = CurrentUserId;
        bool isAdmin = IsInRole(Roles.Admin);
        bool canManageCourse = isAdmin || (IsInRole(Roles.Instructor) && await DbContext.Courses
            .AnyAsync(i => i.Id == request.CourseId && i.InstructorId == userId, ct));
        if (!canManageCourse)
        {
            throw new UnauthorizedAccessException();
        }

        List<string> siblingPositions = await DbContext.Lessons
            .Where(x => x.ChapterId == request.ChapterId && x.Id != request.Id)
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

        if (lesson.LessonType != request.LessonType)
        {
            List<LessonVideo> videos = await DbContext.LessonVideos.Where(x => x.LessonId == request.Id).ToListAsync(ct);
            DbContext.LessonVideos.RemoveRange(videos);
            List<LessonReading> readings = await DbContext.LessonReadings.Where(x => x.LessonId == request.Id).ToListAsync(ct);
            DbContext.LessonReadings.RemoveRange(readings);
            List<LessonCoding> codings = await DbContext.LessonCodings.Where(x => x.LessonId == request.Id).ToListAsync(ct);
            DbContext.LessonCodings.RemoveRange(codings);
            List<LessonQuiz> quizzes = await DbContext.LessonQuizzes.Where(x => x.LessonId == request.Id).ToListAsync(ct);
            DbContext.LessonQuizzes.RemoveRange(quizzes);
        }

        lesson.ChapterId = request.ChapterId;
        lesson.CourseId = request.CourseId;
        lesson.Title = request.Title;
        lesson.LessonType = request.LessonType;
        lesson.Position = position;

        DbContext.Update(lesson);
        return Unit.Value;
    }
}