using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Orders;

public class GetLessonByIdQuery : IRequest<LessonDetailDto?>
{
    public Guid Id { get; set; }
}

internal sealed class GetLessonByIdQueryHandler : AbstractQueryHandler<GetLessonByIdQuery, LessonDetailDto?>
{
    public GetLessonByIdQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<LessonDetailDto?> Handle(GetLessonByIdQuery request, CancellationToken ct)
    {
        Guid studentId = CurrentUserId;

        LessonDetailDto? lesson = await DbContext.Lessons
            .Where(l => l.Id == request.Id)
            .Select(l => new LessonDetailDto
            {
                Id = l.Id,
                Title = l.Title,
                LessonType = l.LessonType,
                Position = l.Position
            })
            .FirstOrDefaultAsync(ct);

        if (lesson == null)
        {
            return null;
        }

        UserLessonProgress? progress = await DbContext.UserLessonProgresses
            .FirstOrDefaultAsync(p => p.StudentId == studentId && p.LessonId == request.Id, ct);

        lesson.IsCompleted = progress?.IsCompleted ?? false;
        lesson.Score = progress?.Score;

        // Populate content based on type using direct queries
        if (lesson.LessonType == LessonType.Video)
        {
            LessonVideo? video = await DbContext.LessonVideos.FirstOrDefaultAsync(v => v.LessonId == lesson.Id, ct);
            lesson.VideoUrl = video?.VideoUrl ?? "";
        }
        else if (lesson.LessonType == LessonType.Reading)
        {
            LessonReading? reading = await DbContext.LessonReadings.FirstOrDefaultAsync(r => r.LessonId == lesson.Id, ct);
            lesson.ReadingContent = reading?.Content ?? "";
        }
        else if (lesson.LessonType == LessonType.Slide)
        {
            LessonSlide? slide = await DbContext.LessonSlides.FirstOrDefaultAsync(s => s.LessonId == lesson.Id, ct);
            lesson.SlideFileUrl = slide?.FileUrl ?? "";
        }
        else if (lesson.LessonType == LessonType.Coding)
        {
            LessonCoding? coding = await DbContext.LessonCodings.FirstOrDefaultAsync(c => c.LessonId == lesson.Id, ct);
            if (coding != null)
            {
                lesson.ExerciseId = coding.ExerciseId;
                lesson.ExerciseTitle = await DbContext.Exercises
                    .Where(e => e.Id == coding.ExerciseId)
                    .Select(e => e.Title)
                    .FirstOrDefaultAsync(ct);
            }
        }
        else if (lesson.LessonType == LessonType.Quiz)
        {
            LessonQuiz? quiz = await DbContext.LessonQuizzes
                .Include(q => q.Questions)
                .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(q => q.LessonId == lesson.Id, ct);
            if (quiz != null)
            {
                lesson.QuizDescription = quiz.Description;
                lesson.QuizPassingScore = quiz.PassingScore;
                lesson.QuizQuestions = quiz.Questions
                    .OrderBy(q => q.Position)
                    .Select(q => new QuizQuestionDto
                    {
                        Id = q.Id,
                        Text = q.Text,
                        Position = q.Position,
                        Answers = q.Answers
                            .OrderBy(a => a.Position)
                            .Select(a => new QuizAnswerDto
                            {
                                Id = a.Id,
                                Text = a.Text,
                                IsCorrect = a.IsCorrect,
                                Position = a.Position
                            }).ToList()
                    }).ToList();
            }
        }

        return lesson;
    }
}