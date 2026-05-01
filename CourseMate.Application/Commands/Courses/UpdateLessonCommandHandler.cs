using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Shared;
using CourseMate.Contracts;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Courses;

public class UpdateLessonCommand : IRequest<int>
{
    public Guid Id { get; set; }

    public Guid ChapterId { get; set; }

    public Guid CourseId { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Title { get; set; } = string.Empty;

    public LessonType LessonType { get; set; }

    [Range(0, int.MaxValue)]
    public int Position { get; set; }
}

internal sealed class UpdateLessonCommandHandler : AbstractCommandHandler<UpdateLessonCommand, int>
{
    public UpdateLessonCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(UpdateLessonCommand request, CancellationToken ct)
    {
        bool isExistedCourse = IsInRole(Roles.Admin) || await DbContext.Courses
            .WhereIf(IsInRole(Roles.Instructor), i => i.InstructorId == CurrentUserId)
            .AnyAsync(i => i.Id == request.CourseId, ct);
        if (!isExistedCourse)
        {
            throw new UnauthorizedAccessException();
        }

        Lesson? lesson = await DbContext.Lessons.FirstOrDefaultAsync(x => x.Id == request.Id &&
                                                                          x.ChapterId == request.ChapterId &&
                                                                          x.CourseId == request.CourseId, ct);
        if (lesson == null)
        {
            throw new EntityNotFoundException(nameof(Lesson), request.Id);
        }

        if (request.Position != 0)
        {
            bool isDuplicate = await DbContext.Lessons.AnyAsync(x => x.ChapterId == request.ChapterId && x.Position == request.Position && x.Id != request.Id, ct);
            if (isDuplicate)
            {
                throw new BusinessException(ErrorMessages.DuplicatePosition);
            }
        }

        int nextPosition = (await DbContext.Lessons
            .Where(x => x.ChapterId == request.ChapterId)
            .MaxAsync(x => (int?)x.Position, ct) ?? 0) + 1;

        int finalPosition = request.Position == 0 ? lesson.Position == 0 ? nextPosition : lesson.Position : request.Position;

        if (finalPosition > nextPosition)
        {
            throw new BusinessException(string.Format(ErrorMessages.PositionOutOfRange, nextPosition));
        }

        if (lesson.LessonType != request.LessonType)
        {
            // If type changed, clear all related content records to avoid "ghost" data
            List<LessonVideo> videos = await DbContext.LessonVideos.Where(x => x.LessonId == request.Id).ToListAsync(ct);
            if (videos.Any())
            {
                DbContext.LessonVideos.RemoveRange(videos);
            }

            List<LessonReading> readings = await DbContext.LessonReadings.Where(x => x.LessonId == request.Id).ToListAsync(ct);
            if (readings.Any())
            {
                DbContext.LessonReadings.RemoveRange(readings);
            }

            List<LessonCoding> codings = await DbContext.LessonCodings.Where(x => x.LessonId == request.Id).ToListAsync(ct);
            if (codings.Any())
            {
                DbContext.LessonCodings.RemoveRange(codings);
            }

            List<LessonQuiz> quizzes = await DbContext.LessonQuizzes.Where(x => x.LessonId == request.Id).ToListAsync(ct);
            if (quizzes.Any())
            {
                DbContext.LessonQuizzes.RemoveRange(quizzes);
            }

            List<LessonSlide> slides = await DbContext.LessonSlides.Where(x => x.LessonId == request.Id).ToListAsync(ct);
            if (slides.Any())
            {
                DbContext.LessonSlides.RemoveRange(slides);
            }
        }

        lesson.ChapterId = request.ChapterId;
        lesson.CourseId = request.CourseId;
        lesson.Title = request.Title;
        lesson.LessonType = request.LessonType;
        lesson.Position = finalPosition;

        DbContext.Update(lesson);
        return Codes.Success;
    }
}