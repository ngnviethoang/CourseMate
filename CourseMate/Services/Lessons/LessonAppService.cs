using CourseMate.Entities.Lessons;
using CourseMate.Entities.Lessons.Articles;
using CourseMate.Entities.Lessons.CodingExercises;
using CourseMate.Entities.Lessons.Quizzes;
using CourseMate.Entities.Lessons.Videos;
using CourseMate.Permissions;
using CourseMate.Services.Dtos.Lessons;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;

namespace CourseMate.Services.Lessons;

[Authorize(CourseMatePermissions.Courses.Default)]
public class LessonAppService : CourseMateAppService, ILessonAppService
{
    public async Task<LessonDto> GetAsync(Guid id)
    {
        IQueryable<LessonDto> queryable =
            from lesson in await LessonRepo.GetQueryableAsync()
            join chapter in await ChapterRepo.GetQueryableAsync()
                on lesson.ChapterId equals chapter.Id
            join course in await CourseRepo.GetQueryableAsync()
                on chapter.CourseId equals course.Id
            where lesson.Id == id
            select new LessonDto
            {
                Id = lesson.Id,
                Title = lesson.Title,
                ChapterId = lesson.ChapterId,
                Position = lesson.Position,
                CreationTime = lesson.CreationTime,
                CreatorId = lesson.CreatorId,
                LastModificationTime = lesson.LastModificationTime,
                LastModifierId = lesson.LastModifierId,
                LessonType = lesson.LessonType,
                CourseId = course.Id
            };
        LessonDto? lessonDto = await AsyncExecuter.FirstOrDefaultAsync(queryable);
        if (lessonDto == null)
        {
            return new LessonDto();
        }

        await HandleGetLessonContentAsync(lessonDto);
        return lessonDto;
    }

    public async Task<PagedResultDto<LessonDto>> GetListAsync(GetListLessonRequestDto input)
    {
        IQueryable<LessonDto> queryable =
            from lesson in await LessonRepo.GetQueryableAsync()
            select new LessonDto
            {
                Id = lesson.Id,
                Title = lesson.Title,
                ChapterId = lesson.ChapterId,
                Position = lesson.Position,
                LessonType = lesson.LessonType,
                CreationTime = lesson.CreationTime,
                CreatorId = lesson.CreatorId,
                LastModificationTime = lesson.LastModificationTime,
                LastModifierId = lesson.LastModifierId
            };
        queryable = queryable
            .WhereIf(input.ChapterId != null, lesson => lesson.ChapterId == input.ChapterId)
            .WhereIf(!string.IsNullOrEmpty(input.Filter), i => i.Title.Contains(input.Filter!))
            .OrderBy(input.Sorting.IsNullOrWhiteSpace() ? nameof(LessonDto.Position) : input.Sorting);

        int totalCount = await AsyncExecuter.CountAsync(queryable);

        if (input.SkipCount.HasValue)
        {
            queryable = queryable.Skip(input.SkipCount.Value);
        }

        if (input.MaxResultCount.HasValue)
        {
            queryable = queryable.Take(input.MaxResultCount.Value);
        }

        List<LessonDto> lessons = await AsyncExecuter.ToListAsync(queryable);
        return new PagedResultDto<LessonDto>(totalCount, lessons);
    }

    [Authorize(CourseMatePermissions.Courses.Create)]
    public async Task<ResultObjectDto> CreateAsync(CreateUpdateLessonDto input)
    {
        if (await LessonRepo.AnyAsync(i => i.Title == input.Title))
        {
            throw new UserFriendlyException("Duplicate lesson name");
        }

        await ChapterRepo.EnsureExistsAsync(input.ChapterId);

        Lesson lesson = new(GuidGenerator.Create(), input.LessonType, input.ChapterId, input.Position, input.Title);
        await LessonRepo.InsertAsync(lesson);

        await NormalizeLessonPositionAsync(lesson);

        await HandleLessonContentAsync(input, lesson.Id);

        return new ResultObjectDto(lesson.Id);
    }

    [Authorize(CourseMatePermissions.Courses.Edit)]
    public async Task<LessonDto> UpdateAsync(Guid id, CreateUpdateLessonDto input)
    {
        bool isDuplicateName = await LessonRepo.AnyAsync(i => i.Title == input.Title && i.Id != id);
        if (isDuplicateName)
        {
            throw new UserFriendlyException("Duplicate lesson name");
        }

        await ChapterRepo.EnsureExistsAsync(input.ChapterId);
        Lesson lesson = await LessonRepo.GetAsync(id);

        lesson.Title = input.Title;
        lesson.ChapterId = input.ChapterId;
        lesson.LessonType = input.LessonType;
        lesson.Position = input.Position;
        await LessonRepo.UpdateAsync(lesson);

        await HandleRemoveLessonContentAsync(lesson.Id, lesson.LessonType);
        await HandleLessonContentAsync(input, lesson.Id);

        await NormalizeLessonPositionAsync(lesson);

        return new LessonDto
        {
            Id = lesson.Id,
            Title = lesson.Title,
            ChapterId = lesson.ChapterId,
            Position = lesson.Position,
            CreationTime = lesson.CreationTime,
            CreatorId = lesson.CreatorId,
            LastModificationTime = lesson.LastModificationTime,
            LastModifierId = lesson.LastModifierId
        };
    }

    [Authorize(CourseMatePermissions.Courses.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        IQueryable<LessonDto> query =
            from lesson in await LessonRepo.GetQueryableAsync()
            where lesson.Id == id
            select new LessonDto
            {
                Id = lesson.Id,
                LessonType = lesson.LessonType
            };
        LessonDto? lessonDto = await AsyncExecuter.FirstOrDefaultAsync(query);
        if (lessonDto is null)
        {
            return;
        }

        await LessonRepo.DeleteAsync(lessonDto.Id);
        await HandleRemoveLessonContentAsync(lessonDto.Id, lessonDto.LessonType);
    }

    private async Task HandleGetLessonContentAsync(LessonDto lessonDto)
    {
        if (lessonDto.LessonType == LessonType.Video)
        {
            IQueryable<VideoDto> queryableVideo =
                from video in await VideoRepo.GetQueryableAsync()
                where video.LessonId == lessonDto.Id
                select new VideoDto
                {
                    Id = video.Id,
                    LessonId = video.LessonId,
                    Duration = video.Duration,
                    VideoFile = video.VideoFile
                };
            lessonDto.Video = await AsyncExecuter.FirstOrDefaultAsync(queryableVideo);
            return;
        }

        if (lessonDto.LessonType == LessonType.Article)
        {
            IQueryable<ArticleDto> queryableArticle =
                from article in await ArticleRepo.GetQueryableAsync()
                where article.LessonId == lessonDto.Id
                select new ArticleDto
                {
                    Id = article.Id,
                    LessonId = article.LessonId,
                    Content = article.Content
                };
            lessonDto.Article = await AsyncExecuter.FirstOrDefaultAsync(queryableArticle);
            return;
        }

        if (lessonDto.LessonType == LessonType.Quiz)
        {
            IQueryable<QuizQuestionDto> queryableQuiz =
                from quizQuestion in await QuizQuestionRepo.GetQueryableAsync()
                join quizOption in await QuizOptionRepo.GetQueryableAsync()
                    on quizQuestion.Id equals quizOption.QuizQuestionId
                where quizQuestion.LessonId == lessonDto.Id
                group new { quizQuestion, quizOption } by quizOption.QuizQuestionId
                into g
                select new QuizQuestionDto
                {
                    Id = g.First().quizQuestion.Id,
                    LessonId = g.First().quizQuestion.LessonId,
                    QuestionText = g.First().quizQuestion.QuestionText,
                    QuizOptions = g.Select(x => new QuizOptionDto
                    {
                        QuizQuestionId = x.quizOption.QuizQuestionId,
                        Id = x.quizOption.QuizQuestionId,
                        IsCorrect = x.quizOption.IsCorrect,
                        Text = x.quizOption.Text
                    })
                };
            lessonDto.QuizQuestions = await AsyncExecuter.ToListAsync(queryableQuiz);
        }

        if (lessonDto.LessonType == LessonType.Coding)
        {
            IQueryable<CodingExerciseDto> queryableCoding =
                from codingExercise in await CodingExerciseRepo.GetQueryableAsync()
                join sampleCode in await SampleCodeRepo.GetQueryableAsync()
                    on codingExercise.Id equals sampleCode.CodingExerciseId
                join testCase in await TestCaseRepo.GetQueryableAsync()
                    on codingExercise.Id equals testCase.CodingExerciseId
                where codingExercise.LessonId == lessonDto.Id
                group new { codingExercise, sampleCode, testCase } by codingExercise.Id
                into g
                select new CodingExerciseDto
                {
                    Id = g.First().codingExercise.Id,
                    LessonId = g.First().codingExercise.LessonId,
                    Title = g.First().codingExercise.Title,
                    Description = g.First().codingExercise.Description,
                    TestCases = g.Select(x => new TestCaseDto
                    {
                        CodingExerciseId = x.testCase.CodingExerciseId,
                        Input = x.testCase.Input,
                        Output = x.testCase.IsHidden ? "" : x.testCase.Output,
                        IsHidden = x.testCase.IsHidden
                    }),
                    SampleCodes = g.Select(x => new SampleCodeDto
                    {
                        CodingExerciseId = x.sampleCode.CodingExerciseId,
                        Id = x.sampleCode.Id,
                        Code = x.sampleCode.Code,
                        LanguageType = x.sampleCode.LanguageType
                    })
                };
            lessonDto.CodingExercise = await AsyncExecuter.FirstOrDefaultAsync(queryableCoding);
        }
    }

    private async Task NormalizeLessonPositionAsync(Lesson lesson)
    {
        List<Lesson> lessons = await LessonRepo.GetListAsync(i => i.ChapterId == lesson.ChapterId && i.Position == lesson.Position);
        lessons.ForEach(i => i.Position = 0);
        await LessonRepo.UpdateManyAsync(lessons);
    }

    private async Task HandleLessonContentAsync(CreateUpdateLessonDto input, Guid lessonId)
    {
        switch (input.LessonType)
        {
            case LessonType.Video when input.Video is not null:
                await HandleVideoLessonAsync(input.Video, lessonId);
                break;
            case LessonType.Article when input.Article is not null:
                await HandleArticleLessonAsync(input.Article, lessonId);
                break;
            case LessonType.Quiz:
                await HandleQuizLessonAsync(input.QuizQuestion, lessonId);
                break;
            case LessonType.Coding when input.CodingExercise is not null:
                await HandleCodingLessonAsync(input.CodingExercise, lessonId);
                break;
            default:
                throw new UserFriendlyException("Invalid or incomplete lesson content");
        }
    }

    private async Task HandleVideoLessonAsync(CreateUpdateVideoDto dto, Guid lessonId)
    {
        Video video = new(GuidGenerator.Create(), dto.VideoFile, dto.Duration, lessonId);
        await VideoRepo.InsertAsync(video);
    }

    private async Task HandleArticleLessonAsync(CreateUpdateArticleDto dto, Guid lessonId)
    {
        Article article = new(GuidGenerator.Create(), lessonId, dto.Content);
        await ArticleRepo.InsertAsync(article);
    }

    private async Task HandleQuizLessonAsync(IEnumerable<CreateUpdateQuizQuestionDto> dtos, Guid lessonId)
    {
        List<QuizQuestion> quizQuestions = [];
        List<QuizOption> quizOptions = [];
        foreach (CreateUpdateQuizQuestionDto dto in dtos)
        {
            QuizQuestion quizQuestion = new(GuidGenerator.Create(), lessonId, dto.QuestionText);
            quizQuestions.Add(quizQuestion);
            quizOptions.AddRange(dto.QuizOptions.Select(i =>
                new QuizOption(GuidGenerator.Create(), quizQuestion.Id, i.Text, i.IsCorrect)));
        }

        await QuizQuestionRepo.InsertManyAsync(quizQuestions);
        await QuizOptionRepo.InsertManyAsync(quizOptions);
    }

    private async Task HandleCodingLessonAsync(CreateUpdateCodingExerciseDto dto, Guid lessonId)
    {
        CodingExercise codingExercise = new(GuidGenerator.Create(), lessonId, dto.Title, dto.Description);

        IEnumerable<TestCase> testCases = dto.TestCases.Select(i =>
            new TestCase(GuidGenerator.Create(), codingExercise.Id, i.Input, i.Output, i.IsHidden));

        IEnumerable<SampleCode> sampleCodes = dto.SampleCodes.Select(i =>
            new SampleCode(GuidGenerator.Create(), codingExercise.Id, i.Code, i.LanguageType));

        await CodingExerciseRepo.InsertAsync(codingExercise);
        await TestCaseRepo.InsertManyAsync(testCases);
        await SampleCodeRepo.InsertManyAsync(sampleCodes);
    }

    private async Task HandleRemoveLessonContentAsync(Guid lessonId, LessonType lessonType)
    {
        switch (lessonType)
        {
            case LessonType.Video:
                await VideoRepo.DeleteAsync(v => v.LessonId == lessonId);
                return;
            case LessonType.Article:
                await ArticleRepo.DeleteAsync(a => a.LessonId == lessonId);
                return;
            case LessonType.Quiz:
                await QuizQuestionRepo.DeleteAsync(q => q.LessonId == lessonId);
                return;
            case LessonType.Coding:
                IQueryable<Guid> query =
                    from codingExercise in await CodingExerciseRepo.GetQueryableAsync()
                    where codingExercise.Id == lessonId
                    select codingExercise.Id;
                List<Guid> codingExerciseIds = await AsyncExecuter.ToListAsync(query);
                await TestCaseRepo.DeleteAsync(t => codingExerciseIds.Contains(t.CodingExerciseId));
                await SampleCodeRepo.DeleteAsync(s => codingExerciseIds.Contains(s.CodingExerciseId));
                await CodingExerciseRepo.DeleteManyAsync(codingExerciseIds);
                return;
        }
    }
}