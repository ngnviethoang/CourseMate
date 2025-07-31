using Crawler.Models.Categories;
using Crawler.Models.Chapters;
using Crawler.Models.Courses;
using Crawler.Models.Lessons;
using Crawler.Response.ActivityResponse;
using Crawler.Response.CategoryResponse;
using Crawler.Response.CourseDetailResponse;
using Crawler.Response.CourseListReponse;
using Newtonsoft.Json;
using Activity = Crawler.Response.CourseDetailResponse.Activity;
using Datum = Crawler.Response.CategoryResponse.Datum;

namespace Crawler;

public static class FormatJson
{
    public static async Task Handle()
    {
        JsonSerializerSettings settings = new()
        {
            Formatting = Formatting.Indented,
            StringEscapeHandling = StringEscapeHandling.Default
        };

        string baseDir = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "Data"));

        string categoryResponseString = await File.ReadAllTextAsync(Path.Combine(baseDir, "categories.json"));
        CategoryResponse categoryObj = JsonConvert.DeserializeObject<CategoryResponse>(categoryResponseString, settings)!;
        Dictionary<int, Guid> cateDict = new();
        List<Category> categories = new();
        foreach (Datum categoryResponse in categoryObj.Data)
        {
            Category category = new()
            {
                Id = Guid.NewGuid(),
                Name = categoryResponse.MultiLangData.Find(i => i.Key == "vn")!.Title,
                Description = $"Description + {Guid.NewGuid()}"
            };
            categories.Add(category);
            cateDict.Add(categoryResponse.Id!.Value, category.Id);
        }

        string courseDetailString = await File.ReadAllTextAsync(Path.Combine(baseDir, "courseDetails.json"));
        List<CourseDetailResponse>? courseDetailJson = JsonConvert.DeserializeObject<List<CourseDetailResponse>>(courseDetailString, settings)!;
        Random random = new();
        List<Course> courses = new();
        List<Chapter> chapters = new();
        List<Lesson> lessons = new();
        Dictionary<int, Guid> activityDict = new();

        string courseList = await File.ReadAllTextAsync(Path.Combine(baseDir, "courseList.json"));
        CourseListReponse courseListJson = JsonConvert.DeserializeObject<CourseListReponse>(courseList, settings)!;
        Dictionary<int?, int?> courseListDict = courseListJson.Data
            .Select(i => new { i.CourseId, i.CategoryId })
            .Distinct()
            .ToDictionary(i => i.CourseId, i => i.CategoryId);

        foreach (CourseDetailResponse courseDetailResponse in courseDetailJson)
        {
            courseListDict.TryGetValue(courseDetailResponse.Data.CourseId, out int? categoryIdInt);
            cateDict.TryGetValue(categoryIdInt ?? -1, out Guid categoryIdGuid);
            Course course = new()
            {
                Id = Guid.NewGuid(),
                CategoryId = categoryIdGuid,
                Currency = CurrencyType.Vnd,
                Description = courseDetailResponse.Data.MultiLangData.Find(i => i.Key == "vn")!.Description,
                Title = courseDetailResponse.Data.MultiLangData.Find(i => i.Key == "vn")!.Title,
                InstructorId = Guid.Empty,
                IsPublished = true,
                LevelType = (LevelType)random.Next(0, 3),
                Price = courseDetailResponse.Data.Price ?? 0,
                ThumbnailFile = courseDetailResponse.Data.Thumbnail,
                Summary = courseDetailResponse.Data.Summary
            };
            courses.Add(course);
            int postitionChapter = 1;
            IEnumerable<Section> sections = courseDetailResponse.Data.CourseSchedule.CourseScheduleList.SelectMany(i => i.Sections) ?? [];
            foreach (Section section in sections)
            {
                Chapter chapter = new()
                {
                    Id = Guid.NewGuid(),
                    Title = section.SectionName,
                    CourseId = course.Id,
                    Position = postitionChapter++
                };
                chapters.Add(chapter);
                int postitionLesson = 1;
                foreach (Activity activity in section.Activities)
                {
                    Lesson lesson = new()
                    {
                        Id = Guid.NewGuid(),
                        Title = activity.ActivityTitle,
                        Position = postitionLesson++,
                        ChapterId = chapter.Id,
                        Content = string.Empty,
                        Duration = TimeSpan.FromMinutes(activity.Duration ?? 0),
                        VideoFile = null,
                        CodeSampleJson = null,
                        CorrectAnswerJson = null,
                        Explanation = null,
                        OptionsJson = null,
                        Type = LessonType.Coding
                    };
                    lessons.Add(lesson);
                    activityDict.Add(activity.ActivityId!.Value, lesson.Id);
                }
            }
        }

        Dictionary<Guid, Lesson> lessonDict = lessons.ToDictionary(l => l.Id);
        string activityResponseString = await File.ReadAllTextAsync(Path.Combine(baseDir, "activities.json"));
        List<ActivityResponse>? activityObj = JsonConvert.DeserializeObject<List<ActivityResponse>>(activityResponseString, settings)!;
        foreach (ActivityResponse activityResponse in activityObj)
        {
            Response.ActivityResponse.Activity? activity = activityResponse.Data?.CodeActivity?.Activity;
            if (activity != null)
            {
                activityDict.TryGetValue(activity.Id!.Value, out Guid activityId);
                lessonDict.TryGetValue(activityId, out Lesson? lesson);
                if (lesson != null)
                {
                    lesson.Content = activity.MultiLangData.FirstOrDefault(i => i.Key == "vn")?.Description ?? string.Empty;
                    lesson.VideoFile = null;
                    lesson.CodeSampleJson = null;
                    lesson.CorrectAnswerJson = null;
                    lesson.Explanation = null;
                    lesson.OptionsJson = null;
                    lesson.Type = LessonType.Coding;
                }
            }
        }

        baseDir = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "FormatData"));
        Directory.CreateDirectory(baseDir);
        string json = JsonConvert.SerializeObject(categories, settings);
        await File.WriteAllTextAsync(Path.Combine(baseDir, "categories.json"), json);

        json = JsonConvert.SerializeObject(courses, settings);
        await File.WriteAllTextAsync(Path.Combine(baseDir, "courses.json"), json);

        json = JsonConvert.SerializeObject(chapters, settings);
        await File.WriteAllTextAsync(Path.Combine(baseDir, "chapters.json"), json);

        json = JsonConvert.SerializeObject(lessons, settings);
        await File.WriteAllTextAsync(Path.Combine(baseDir, "lessons.json"), json);
    }
}