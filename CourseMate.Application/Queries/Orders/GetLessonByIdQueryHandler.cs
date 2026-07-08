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

public sealed class GetLessonByIdQueryHandler : AbstractQueryHandler<GetLessonByIdQuery, LessonDetailDto?>
{
    public GetLessonByIdQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<LessonDetailDto?> Handle(GetLessonByIdQuery request, CancellationToken ct)
    {
        Guid studentId = CurrentUserId;

        LessonItem? lessonItem = await DbContext.Lessons
            .Where(l => l.Id == request.Id)
            .Select(l => new LessonItem(l.Id, l.ChapterId, l.Title, l.LessonType, l.Position))
            .FirstOrDefaultAsync(ct);

        if (lessonItem == null)
        {
            return null;
        }

        List<Guid> lessonOrder = await DbContext.Lessons
            .Where(x => x.ChapterId == lessonItem.ChapterId)
            .OrderBy(x => x.Position)
            .Select(x => x.Id)
            .ToListAsync(ct);

        int sortOrder = lessonOrder.FindIndex(x => x == lessonItem.Id) + 1;
        LessonDetailDto lesson = new()
        {
            Id = lessonItem.Id,
            Title = lessonItem.Title,
            LessonType = lessonItem.LessonType,
            Position = lessonItem.PositionKey,
            SortOrder = sortOrder < 1 ? 1 : sortOrder
        };

        UserLessonProgress? progress = await DbContext.UserLessonProgresses
            .FirstOrDefaultAsync(p => p.StudentId == studentId && p.LessonId == request.Id, ct);

        lesson.IsCompleted = progress?.IsCompleted ?? false;
        lesson.Score = progress?.Score;

        switch (lesson.LessonType)
        {
            case LessonType.Video:
            {
                LessonVideo? video = await DbContext.LessonVideos.FirstOrDefaultAsync(v => v.LessonId == lesson.Id, ct);
                lesson.VideoUrl = video?.VideoUrl;
                break;
            }
            case LessonType.Reading:
            {
                LessonReading? reading = await DbContext.LessonReadings.FirstOrDefaultAsync(r => r.LessonId == lesson.Id, ct);
                lesson.ReadingContent = reading?.Content;
                break;
            }
            case LessonType.Coding:
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

                break;
            }
            case LessonType.Quiz:
            {
                await QueryLessonQuiz(lesson);
                break;
            }
        }

        return lesson;
    }

    private async Task QueryLessonQuiz(LessonDetailDto lesson)
    {
        LessonQuiz? lessonQuiz = await DbContext.LessonQuizzes.FirstOrDefaultAsync(q => q.LessonId == lesson.Id);
        if (lessonQuiz != null)
        {
            lesson.QuizDescription = lessonQuiz.Description;
            lesson.QuizPassingScore = lessonQuiz.PassingScore;

            List<LessonQuizQuestion> lessonQuizQuestions = await DbContext.LessonQuizQuestions
                .Where(q => q.LessonQuizId == lessonQuiz.Id)
                .OrderBy(q => q.Position)
                .ToListAsync();

            IEnumerable<Guid> lessonQuizQuestionIds = lessonQuizQuestions.Select(q => q.Id);

            List<LessonQuizAnswer> lessonQuizAnswer = await DbContext.LessonQuizAnswers
                .Where(a => lessonQuizQuestionIds.Contains(a.LessonQuizQuestionId))
                .OrderBy(a => a.Position)
                .ToListAsync();

            lesson.QuizQuestions = lessonQuizQuestions
                .Select(q => new QuizQuestionDto
                {
                    Id = q.Id,
                    Text = q.Text,
                    Position = q.Position,
                    Answers = lessonQuizAnswer
                        .Where(a => a.LessonQuizQuestionId == q.Id)
                        .OrderBy(a => a.Position)
                        .Select(a => new QuizAnswerDto
                        {
                            Id = a.Id,
                            Text = a.Text,
                            IsCorrect = a.IsCorrect,
                            Position = a.Position
                        })
                        .ToList()
                })
                .ToList();
        }
    }

    private sealed record LessonItem(Guid Id, Guid ChapterId, string Title, LessonType LessonType, string PositionKey);
}