using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Students;
using CourseMate.Contracts.Enums;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Students;

internal sealed class GetLessonByIdQueryHandler : AbstractQueryHandler<GetLessonByIdQuery, LessonDetailDto?>
{
    public GetLessonByIdQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<LessonDetailDto?> Handle(GetLessonByIdQuery request, CancellationToken cancellationToken)
    {
        Guid studentId = GetCurrentUserId();

        LessonDetailDto? lesson = await DbContext.Lessons
            .Where(l => l.Id == request.Id)
            .Select(l => new LessonDetailDto
            {
                Id = l.Id,
                Title = l.Title,
                LessonType = l.LessonType,
                Position = l.Position
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (lesson == null)
        {
            return null;
        }

        // Check if completed
        lesson.IsCompleted = await DbContext.UserLessonProgresses
            .AnyAsync(p => p.StudentId == studentId && p.LessonId == request.Id && p.IsCompleted, cancellationToken);

        // Fetch content based on type
        switch (lesson.LessonType)
        {
            case LessonType.Video:
                LessonVideo? video = await DbContext.LessonVideos
                    .FirstOrDefaultAsync(v => v.LessonId == request.Id, cancellationToken);
                lesson.VideoUrl = video?.VideoUrl;
                break;
            case LessonType.Reading:
                LessonReading? reading = await DbContext.LessonReadings
                    .FirstOrDefaultAsync(r => r.LessonId == request.Id, cancellationToken);
                lesson.ReadingContent = reading?.Content;
                break;
            case LessonType.Coding:
                LessonCoding? coding = await DbContext.LessonCodings
                    .FirstOrDefaultAsync(c => c.LessonId == request.Id, cancellationToken);
                if (coding != null)
                {
                    lesson.ProblemStatement = coding.ProblemStatement;
                    lesson.StarterCode = coding.StarterCode;
                    lesson.ExpectedOutput = coding.ExpectedOutput;
                }

                break;
            case LessonType.Quiz:
                LessonQuiz? quiz = await DbContext.LessonQuizzes
                    .FirstOrDefaultAsync(q => q.LessonId == request.Id, cancellationToken);
                if (quiz != null)
                {
                    lesson.QuizDescription = quiz.Description;
                    lesson.QuizPassingScore = quiz.PassingScore;
                }

                break;
        }

        return lesson;
    }
}