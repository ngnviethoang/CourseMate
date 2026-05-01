using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Courses;

/// <summary>
///     Shared helper to check if the current user has permission to manage a lesson's content.
/// </summary>
internal static class LessonAccessHelper
{
    internal static async Task<Guid> EnsureAccessAndGetCourseIdAsync(
        CourseMateDbContext db,
        Guid lessonId,
        bool isAdmin,
        bool isInstructor,
        Guid currentUserId,
        CancellationToken ct)
    {
        Lesson? lesson = await db.Lessons.FirstOrDefaultAsync(l => l.Id == lessonId, ct);
        if (lesson is null)
        {
            throw new EntityNotFoundException(nameof(Lesson), lessonId);
        }

        bool hasAccess = isAdmin || await db.Courses
            .WhereIf(isInstructor, c => c.InstructorId == currentUserId)
            .AnyAsync(c => c.Id == lesson.CourseId, ct);

        if (!hasAccess)
        {
            throw new UnauthorizedAccessException();
        }

        return lesson.CourseId;
    }
}

// ── Video ──────────────────────────────────────────────────────────────────────

public class UpsertLessonVideoCommand : UpsertLessonVideoRequest, IRequest<Unit>
{
    public Guid LessonId { get; set; }
}

internal sealed class UpsertLessonVideoCommandHandler : AbstractCommandHandler<UpsertLessonVideoCommand, Unit>
{
    public UpsertLessonVideoCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<Unit> Handle(UpsertLessonVideoCommand request, CancellationToken ct)
    {
        await LessonAccessHelper.EnsureAccessAndGetCourseIdAsync(DbContext, request.LessonId, IsInRole(Roles.Admin), IsInRole(Roles.Instructor), CurrentUserId, ct);

        LessonVideo? existing = await DbContext.LessonVideos.FirstOrDefaultAsync(v => v.LessonId == request.LessonId, ct);
        if (existing is null)
        {
            await DbContext.LessonVideos.AddAsync(new LessonVideo(Guid.NewGuid(), request.LessonId, request.VideoUrl), ct);
        }
        else
        {
            existing.VideoUrl = request.VideoUrl;
        }

        await DbContext.SaveChangesAsync(ct);
        return Unit.Value;
    }
}

// ── Reading ────────────────────────────────────────────────────────────────────

public class UpsertLessonReadingCommand : UpsertLessonReadingRequest, IRequest<Unit>
{
    public Guid LessonId { get; set; }
}

internal sealed class UpsertLessonReadingCommandHandler : AbstractCommandHandler<UpsertLessonReadingCommand, Unit>
{
    public UpsertLessonReadingCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<Unit> Handle(UpsertLessonReadingCommand request, CancellationToken ct)
    {
        await LessonAccessHelper.EnsureAccessAndGetCourseIdAsync(DbContext, request.LessonId, IsInRole(Roles.Admin), IsInRole(Roles.Instructor), CurrentUserId, ct);

        LessonReading? existing = await DbContext.LessonReadings.FirstOrDefaultAsync(r => r.LessonId == request.LessonId, ct);
        if (existing is null)
        {
            await DbContext.LessonReadings.AddAsync(new LessonReading(Guid.NewGuid(), request.LessonId, request.Content), ct);
        }
        else
        {
            existing.Content = request.Content;
        }

        await DbContext.SaveChangesAsync(ct);
        return Unit.Value;
    }
}

// ── Coding ────────────────────────────────────────────────────────────────────

public class UpsertLessonCodingCommand : UpsertLessonCodingRequest, IRequest<Unit>
{
    public Guid LessonId { get; set; }
}

internal sealed class UpsertLessonCodingCommandHandler : AbstractCommandHandler<UpsertLessonCodingCommand, Unit>
{
    public UpsertLessonCodingCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<Unit> Handle(UpsertLessonCodingCommand request, CancellationToken ct)
    {
        await LessonAccessHelper.EnsureAccessAndGetCourseIdAsync(DbContext, request.LessonId, IsInRole(Roles.Admin), IsInRole(Roles.Instructor), CurrentUserId, ct);

        bool exerciseExists = await DbContext.Exercises.AnyAsync(e => e.Id == request.ExerciseId, ct);
        if (!exerciseExists)
        {
            throw new EntityNotFoundException(nameof(Exercise), request.ExerciseId);
        }

        LessonCoding? existing = await DbContext.LessonCodings.FirstOrDefaultAsync(c => c.LessonId == request.LessonId, ct);
        if (existing is null)
        {
            await DbContext.LessonCodings.AddAsync(new LessonCoding(Guid.NewGuid(), request.LessonId, request.ExerciseId), ct);
        }
        else
        {
            existing.ExerciseId = request.ExerciseId;
        }

        await DbContext.SaveChangesAsync(ct);
        return Unit.Value;
    }
}

// ── Quiz ──────────────────────────────────────────────────────────────────────

public class UpsertLessonQuizCommand : UpsertLessonQuizRequest, IRequest<Unit>
{
    public Guid LessonId { get; set; }
}

internal sealed class UpsertLessonQuizCommandHandler : AbstractCommandHandler<UpsertLessonQuizCommand, Unit>
{
    public UpsertLessonQuizCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<Unit> Handle(UpsertLessonQuizCommand request, CancellationToken ct)
    {
        await LessonAccessHelper.EnsureAccessAndGetCourseIdAsync(DbContext, request.LessonId, IsInRole(Roles.Admin), IsInRole(Roles.Instructor), CurrentUserId, ct);

        LessonQuiz? existing = await DbContext.LessonQuizzes.FirstOrDefaultAsync(q => q.LessonId == request.LessonId, ct);

        if (existing is null)
        {
            existing = new LessonQuiz(Guid.NewGuid(), request.LessonId, request.Description, request.PassingScore);
            await DbContext.LessonQuizzes.AddAsync(existing, ct);
        }
        else
        {
            existing.Description = request.Description;
            existing.PassingScore = request.PassingScore;

            // Hard delete old questions and answers to avoid soft-delete conflicts and concurrency issues
            await DbContext.LessonQuizQuestions
                .IgnoreQueryFilters()
                .Where(q => q.QuizId == existing.Id)
                .ExecuteDeleteAsync(ct);
        }

        // Add new questions
        foreach (QuizQuestionDto q in request.Questions)
        {
            LessonQuizQuestion question = new(Guid.NewGuid(), existing.Id, q.Text, q.Position);
            foreach (QuizAnswerDto a in q.Answers)
            {
                question.Answers.Add(new LessonQuizAnswer(Guid.NewGuid(), question.Id, a.Text, a.IsCorrect, a.Position));
            }

            await DbContext.LessonQuizQuestions.AddAsync(question, ct);
        }

        await DbContext.SaveChangesAsync(ct);
        return Unit.Value;
    }
}

// ── Slide ─────────────────────────────────────────────────────────────────────

public class UpsertLessonSlideCommand : UpsertLessonSlideRequest, IRequest<Unit>
{
    public Guid LessonId { get; set; }
}

internal sealed class UpsertLessonSlideCommandHandler : AbstractCommandHandler<UpsertLessonSlideCommand, Unit>
{
    public UpsertLessonSlideCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<Unit> Handle(UpsertLessonSlideCommand request, CancellationToken ct)
    {
        await LessonAccessHelper.EnsureAccessAndGetCourseIdAsync(DbContext, request.LessonId, IsInRole(Roles.Admin), IsInRole(Roles.Instructor), CurrentUserId, ct);

        LessonSlide? existing = await DbContext.LessonSlides.FirstOrDefaultAsync(s => s.LessonId == request.LessonId, ct);
        if (existing is null)
        {
            await DbContext.LessonSlides.AddAsync(new LessonSlide(Guid.NewGuid(), request.LessonId, request.FileUrl), ct);
        }
        else
        {
            existing.FileUrl = request.FileUrl;
        }

        await DbContext.SaveChangesAsync(ct);
        return Unit.Value;
    }
}