using Crawler.Models.Categories;
using Crawler.Models.Chapters;
using Crawler.Models.Courses;
using Crawler.Models.Lessons;
using Crawler.Response.CategoryResponse;
using Crawler.Response.CourseDetailResponse;
using Crawler.Response.CourseListReponse;
using Newtonsoft.Json;
using Datum = Crawler.Response.CategoryResponse.Datum;

namespace Crawler;

public static class FormatJson
{
    public static async Task Handle()
    {
        JsonSerializerSettings settings = new JsonSerializerSettings
        {
            Formatting = Formatting.Indented,
            StringEscapeHandling = StringEscapeHandling.Default,
        };

        string baseDir = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "Data"));

        string categoryResponseString = await File.ReadAllTextAsync(Path.Combine(baseDir, "categories.json"));
        CategoryResponse categoryJson = JsonConvert.DeserializeObject<CategoryResponse>(categoryResponseString, settings)!;
        Dictionary<int, Guid> cateDict = new();
        List<Category> categories = new();
        foreach (Datum categoryResponse in categoryJson.Data)
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
            foreach (CourseScheduleList courseScheduleList in courseDetailResponse.Data.CourseSchedule.CourseScheduleList)
            {
                Chapter chapter = new()
                {
                    Id = Guid.NewGuid(),
                    Title = courseScheduleList.ScheduleTitle,
                    CourseId = course.Id,
                    Position = postitionChapter++
                };
                chapters.Add(chapter);
                int postitionLesson = 1;
                foreach (Section section in courseScheduleList.Sections)
                {
                    Lesson lesson = new()
                    {
                        Id = Guid.NewGuid(),
                        Title = section.SectionName,
                        Position = postitionLesson++,
                        ChapterId = chapter.Id,
                        ContentText = section.Activities.FirstOrDefault()?.ActivityTitle ?? string.Empty,
                        Duration = TimeSpan.FromMinutes(random.Next(1, 20)),
                        VideoFile = string.Empty
                    };
                    lessons.Add(lesson);
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