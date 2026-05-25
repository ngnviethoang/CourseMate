using CourseMate.Application.Shared;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Courses;

public class CreateOrUpdateLessonQuizCommand : IRequest<Unit>
{
    public Guid LessonId { get; set; }

    public string Description { get; set; } = string.Empty;
    public int PassingScore { get; set; }

    public List<CreateOrUpdateQuizQuestionDto> Questions { get; set; } = [];

    public class CreateOrUpdateQuizQuestionDto
    {
        public Guid Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public int Position { get; set; }
        public List<CreateOrUpdateQuizAnswerDto> Answers { get; set; } = [];
    }

    public class CreateOrUpdateQuizAnswerDto
    {
        public Guid Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
        public int Position { get; set; }
    }
}

internal sealed class CreateOrUpdateLessonQuizCommandHandler : AbstractCommandHandler<CreateOrUpdateLessonQuizCommand, Unit>
{
    public CreateOrUpdateLessonQuizCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<Unit> Handle(CreateOrUpdateLessonQuizCommand request, CancellationToken ct)
    {
        await EnsureAuthorCourseAsync(request.LessonId, ct);

        LessonQuiz? lessonQuiz = await DbContext.LessonQuizzes.FirstOrDefaultAsync(q => q.LessonId == request.LessonId, ct);

        if (lessonQuiz is null)
        {
            lessonQuiz = new LessonQuiz(Guid.NewGuid(), request.LessonId, request.Description, request.PassingScore);
            await DbContext.LessonQuizzes.AddAsync(lessonQuiz, ct);
        }
        else
        {
            lessonQuiz.Description = request.Description;
            lessonQuiz.PassingScore = request.PassingScore;

            List<LessonQuizQuestion> lessonQuizQuestions = await DbContext.LessonQuizQuestions
                .Where(quizQuestion => quizQuestion.LessonQuizId == lessonQuiz.Id)
                .ToListAsync(ct);
            DbContext.LessonQuizQuestions.RemoveRange(lessonQuizQuestions);
        }

        foreach (CreateOrUpdateLessonQuizCommand.CreateOrUpdateQuizQuestionDto quizQuestionDto in request.Questions)
        {
            LessonQuizQuestion question = new(Guid.NewGuid(), lessonQuiz.Id, quizQuestionDto.Text, quizQuestionDto.Position);
            foreach (CreateOrUpdateLessonQuizCommand.CreateOrUpdateQuizAnswerDto a in quizQuestionDto.Answers)
            {
                DbContext.LessonQuizAnswers.Add(new LessonQuizAnswer(Guid.NewGuid(), question.Id, a.Text, a.IsCorrect, a.Position));
            }

            await DbContext.LessonQuizQuestions.AddAsync(question, ct);
        }

        return Unit.Value;
    }
}