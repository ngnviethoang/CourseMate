using System.Text.Json;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CourseMate.Persistent;

public static class DbSeeder
{
    public static async Task SeedTnitialAsync(this IServiceProvider services)
    {
        using IServiceScope scope = services.CreateScope();
        RoleManager<IdentityRole<Guid>> roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        UserManager<User> userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        CourseMateDbContext dbContext = scope.ServiceProvider.GetRequiredService<CourseMateDbContext>();

        IReadOnlyList<string> roles = [Roles.Admin, Roles.Instructor, Roles.Student];
        foreach (string role in roles)
        {
            await roleManager.CreateAsync(new IdentityRole<Guid>(role));
        }

        IReadOnlyDictionary<string, string> userRoleDict = new Dictionary<string, string>
        {
            ["admin"] = Roles.Admin,
            ["manager"] = Roles.Admin,
            ["instructor1"] = Roles.Instructor,
            ["instructor2"] = Roles.Instructor,
            ["instructor3"] = Roles.Instructor,
            ["student1"] = Roles.Student,
            ["student2"] = Roles.Student,
            ["student3"] = Roles.Student
        };
        List<Guid> instructorIds = [];
        foreach (KeyValuePair<string, string> userRole in userRoleDict)
        {
            User user = new() { UserName = userRole.Key, Email = $"{userRole.Key}@example.com", EmailConfirmed = true, IsApproved = true };
            await userManager.CreateAsync(user, "User@123");
            await userManager.AddToRoleAsync(user, userRole.Value);
            if (string.Equals(Roles.Instructor, userRole.Value))
            {
                instructorIds.Add(user.Id);
            }
        }

        string projectDomain = Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory())!.Parent!.FullName, "Seeds");
        string jsonFilePath = Path.Combine(projectDomain, "categories.json");
        string json = await File.ReadAllTextAsync(jsonFilePath);

        List<Category> categories = JsonSerializer.Deserialize<List<Category>>(json)!;
        categories.ForEach(i => i.IsActive = true);
        await dbContext.Categories.AddRangeAsync(categories);

        Random random = new();
        jsonFilePath = Path.Combine(projectDomain, "courses.json");
        json = await File.ReadAllTextAsync(jsonFilePath);
        List<Course> courses = JsonSerializer.Deserialize<List<Course>>(json)!;
        foreach (Course i in courses)
        {
            i.InstructorId = instructorIds.ElementAtOrDefault(random.Next(instructorIds.Count));
        }

        await dbContext.Courses.AddRangeAsync(courses);
        jsonFilePath = Path.Combine(projectDomain, "chapters.json");
        json = await File.ReadAllTextAsync(jsonFilePath);
        List<Chapter> chapters = JsonSerializer.Deserialize<List<Chapter>>(json)!;
        Dictionary<Guid, Guid> chapterDict = chapters.ToDictionary(i => i.Id, i => i.CourseId);
        await dbContext.Chapters.AddRangeAsync(chapters);

        jsonFilePath = Path.Combine(projectDomain, "lessons.json");
        json = await File.ReadAllTextAsync(jsonFilePath);
        List<Lesson> lessons = JsonSerializer.Deserialize<List<Lesson>>(json)!;
        lessons.ForEach(i =>
        {
            if (chapterDict.TryGetValue(i.ChapterId, out Guid courseId))
            {
                i.CourseId = courseId;
            }
        });
        await dbContext.Lessons.AddRangeAsync(lessons);
        await dbContext.SaveChangesAsync();
    }

    public static async Task SeedLessonOrderDataAsync(this IServiceProvider services)
    {
        using IServiceScope scope = services.CreateScope();
        UserManager<User> userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        CourseMateDbContext dbContext = scope.ServiceProvider.GetRequiredService<CourseMateDbContext>();

        List<Lesson> lessons = await dbContext.Lessons.ToListAsync();
        List<Course> courses = await dbContext.Courses.ToListAsync();
        IList<User> instructors = await userManager.GetUsersInRoleAsync(Roles.Instructor);
        IList<User> studentId = await userManager.GetUsersInRoleAsync(Roles.Student);
        await SeedLessonContentAsync(dbContext, lessons, instructors.Select(x => x.Id).ToList());
        await SeedOrdersAsync(dbContext, courses, studentId.Select(x => x.Id).ToList());
        await dbContext.SaveChangesAsync();
    }

    private static async Task SeedLessonContentAsync(CourseMateDbContext dbContext, List<Lesson> lessons, List<Guid> instructorIds)
    {
        Guid creatorId = instructorIds.First();
        Exercise[] exercises =
        [
            new(Guid.NewGuid(),
                "Tính tổng hai số",
                "Cho hai số nguyên a và b trên một dòng, in ra tổng của chúng.",
                ExerciseDifficultyType.Easy, "Math", creatorId,
                ["Giá trị a, b nằm trong khoảng [-10^9, 10^9]"],
                ["Dùng toán tử + để cộng hai số"]),

            new(Guid.NewGuid(),
                "Kiểm tra chuỗi Palindrome",
                "Cho một chuỗi s, kiểm tra xem s có phải palindrome không (chỉ xét ký tự chữ-số, không phân biệt hoa thường). In \"true\" hoặc \"false\".",
                ExerciseDifficultyType.Easy, "String", creatorId,
                ["Chỉ xét ký tự chữ cái và chữ số", "Không phân biệt hoa thường"],
                ["So sánh chuỗi đã chuẩn hoá với bản đảo ngược của nó"]),

            new(Guid.NewGuid(),
                "Tìm kiếm nhị phân",
                "Cho mảng n số nguyên đã sắp xếp tăng dần và một số target. Trả về chỉ số (0-based) của target trong mảng; nếu không tìm thấy trả về -1.",
                ExerciseDifficultyType.Medium, "Array", creatorId,
                ["Mảng đã sắp xếp tăng dần", "Yêu cầu độ phức tạp O(log n)"],
                ["Dùng hai con trỏ left/right", "Tính mid = (left + right) / 2 để tránh tràn số"])
        ];

        await dbContext.Exercises.AddRangeAsync(exercises);

        await dbContext.ExerciseTestCases.AddRangeAsync(new ExerciseTestCase(Guid.NewGuid(), exercises[0].Id, "1 2", "3", "1 + 2 = 3", false, 1), new ExerciseTestCase(Guid.NewGuid(), exercises[0].Id, "0 0", "0", "0 + 0 = 0", false, 2), new ExerciseTestCase(Guid.NewGuid(), exercises[0].Id, "-5 10", "5", "Số âm + số dương", true, 3), new ExerciseTestCase(Guid.NewGuid(), exercises[0].Id, "1000000000 999999999", "1999999999", "Số lớn", true, 4), new ExerciseTestCase(Guid.NewGuid(), exercises[1].Id, "racecar", "true", "Palindrome đơn từ", false, 1), new ExerciseTestCase(Guid.NewGuid(), exercises[1].Id, "hello", "false", "Không phải palindrome", false, 2), new ExerciseTestCase(Guid.NewGuid(), exercises[1].Id, "A man a plan a canal Panama", "true", "Palindrome nhiều từ", true, 3), new ExerciseTestCase(Guid.NewGuid(), exercises[1].Id, "Was it a car or a cat I saw", "true", "Palindrome có dấu câu", true, 4), new ExerciseTestCase(Guid.NewGuid(), exercises[2].Id, "5\n1 3 5 7 9\n3", "1", "Tìm thấy ở giữa", false, 1), new ExerciseTestCase(Guid.NewGuid(), exercises[2].Id, "5\n1 3 5 7 9\n1", "0", "Tìm thấy đầu mảng", false, 2), new ExerciseTestCase(Guid.NewGuid(), exercises[2].Id, "5\n1 3 5 7 9\n10", "-1", "Không tìm thấy", false, 3), new ExerciseTestCase(Guid.NewGuid(), exercises[2].Id, "1\n5\n5", "0", "Mảng một phần tử", true, 4));

        await dbContext.ExerciseExamples.AddRangeAsync(new ExerciseExample(Guid.NewGuid(), exercises[0].Id, "1 2", "3", "1 + 2 = 3"), new ExerciseExample(Guid.NewGuid(), exercises[0].Id, "-1 5", "4", "-1 + 5 = 4"), new ExerciseExample(Guid.NewGuid(), exercises[1].Id, "racecar", "true", "\"racecar\" đọc ngược vẫn là \"racecar\""), new ExerciseExample(Guid.NewGuid(), exercises[1].Id, "hello", "false", "\"hello\" đọc ngược là \"olleh\""), new ExerciseExample(Guid.NewGuid(), exercises[2].Id, "5\n1 3 5 7 9\n3", "1", "target=3 tại chỉ số 1"), new ExerciseExample(Guid.NewGuid(), exercises[2].Id, "3\n1 2 3\n5", "-1", "target=5 không có trong mảng"));

        await dbContext.ExerciseDefaultCodes.AddRangeAsync(new ExerciseDefaultCode(Guid.NewGuid(), exercises[0].Id, "python",
            "a, b = map(int, input().split())\n# Viết code của bạn tại đây\n"), new ExerciseDefaultCode(Guid.NewGuid(), exercises[0].Id, "javascript",
            "const [a, b] = require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ').map(Number);\n// Viết code của bạn tại đây\n"), new ExerciseDefaultCode(Guid.NewGuid(), exercises[1].Id, "python",
            "s = input()\n# Viết code của bạn tại đây\n# Output: true hoặc false\n"), new ExerciseDefaultCode(Guid.NewGuid(), exercises[1].Id, "javascript",
            "const s = require('fs').readFileSync('/dev/stdin','utf8').trim();\n// Viết code của bạn tại đây\n// Output: true hoặc false\n"), new ExerciseDefaultCode(Guid.NewGuid(), exercises[2].Id, "python",
            "n = int(input())\narr = list(map(int, input().split()))\ntarget = int(input())\n# Viết code của bạn tại đây\n"), new ExerciseDefaultCode(Guid.NewGuid(), exercises[2].Id, "javascript",
            "const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');\nconst n = parseInt(lines[0]);\nconst arr = lines[1].split(' ').map(Number);\nconst target = parseInt(lines[2]);\n// Viết code của bạn tại đây\n"));

        // Lesson materials keyed on LessonType

        List<LessonReading> readings = [];
        List<LessonVideo> videos = [];
        List<LessonQuiz> quizzes = [];
        List<LessonQuizQuestion> questions = [];
        List<LessonQuizAnswer> answers = [];
        List<LessonCoding> codings = [];

        string[] videoUrls =
        [
            "https://www.youtube.com/embed/rfscVS0vtbw",
            "https://www.youtube.com/embed/zOjov-2OZ0E",
            "https://www.youtube.com/embed/W6NZfCO5SIk",
            "https://www.youtube.com/embed/kqtD5dpn9C8",
            "https://www.youtube.com/embed/HXV3zeQKqGY"
        ];

        int videoIdx = 0;
        int codingIdx = 0;

        foreach (Lesson lesson in lessons)
        {
            switch (lesson.LessonType)
            {
                case LessonType.Reading:
                    readings.Add(new LessonReading(Guid.NewGuid(), lesson.Id,
                        $"<h2>{lesson.Title}</h2>" +
                        $"<p>Trong bài học này, chúng ta sẽ tìm hiểu về <strong>{lesson.Title}</strong>. " +
                        "Đây là phần kiến thức quan trọng giúp bạn xây dựng nền tảng vững chắc.</p>" +
                        "<h3>Nội dung chính</h3><ul>" +
                        "<li>Khái niệm cơ bản và ý nghĩa</li>" +
                        "<li>Cách áp dụng trong thực tế</li>" +
                        "<li>Ví dụ minh hoạ cụ thể</li>" +
                        "<li>Các lỗi thường gặp cần tránh</li>" +
                        "</ul>" +
                        "<h3>Tóm tắt</h3>" +
                        "<p>Sau khi hoàn thành bài này, bạn đã nắm được nền tảng để tiếp tục với các bài học tiếp theo. " +
                        "Hãy thực hành thường xuyên để củng cố kiến thức.</p>"));
                    break;

                case LessonType.Video:
                    videos.Add(new LessonVideo(Guid.NewGuid(), lesson.Id, videoUrls[videoIdx++ % videoUrls.Length]));
                    break;

                case LessonType.Quiz:
                {
                    Guid quizId = Guid.NewGuid();
                    quizzes.Add(new LessonQuiz(quizId, lesson.Id, $"Kiểm tra kiến thức về {lesson.Title}", 70));

                    Guid q1 = Guid.NewGuid();
                    Guid q2 = Guid.NewGuid();
                    questions.Add(new LessonQuizQuestion(q1, quizId, $"Mục đích chính của {lesson.Title} là gì?", 1));
                    questions.Add(new LessonQuizQuestion(q2, quizId, $"Bước đầu tiên khi tiếp cận {lesson.Title} là gì?", 2));

                    answers.AddRange([
                        new LessonQuizAnswer(Guid.NewGuid(), q1, "Giải quyết vấn đề một cách hiệu quả", true, 1),
                        new LessonQuizAnswer(Guid.NewGuid(), q1, "Ghi nhớ toàn bộ lý thuyết", false, 2),
                        new LessonQuizAnswer(Guid.NewGuid(), q1, "Bỏ qua phần thực hành", false, 3),
                        new LessonQuizAnswer(Guid.NewGuid(), q1, "Chỉ đọc tài liệu tham khảo", false, 4),

                        new LessonQuizAnswer(Guid.NewGuid(), q2, "Hiểu rõ khái niệm cơ bản", true, 1),
                        new LessonQuizAnswer(Guid.NewGuid(), q2, "Học thuộc lòng ngay lập tức", false, 2),
                        new LessonQuizAnswer(Guid.NewGuid(), q2, "Bỏ qua phần giới thiệu", false, 3),
                        new LessonQuizAnswer(Guid.NewGuid(), q2, "Làm bài tập trước khi đọc lý thuyết", false, 4)
                    ]);
                    break;
                }

                case LessonType.Coding:
                    codings.Add(new LessonCoding(Guid.NewGuid(), lesson.Id, exercises[codingIdx++ % exercises.Length].Id));
                    break;
            }
        }

        await dbContext.LessonReadings.AddRangeAsync(readings);
        await dbContext.LessonVideos.AddRangeAsync(videos);
        await dbContext.LessonQuizzes.AddRangeAsync(quizzes);
        await dbContext.LessonQuizQuestions.AddRangeAsync(questions);
        await dbContext.LessonQuizAnswers.AddRangeAsync(answers);
        await dbContext.LessonCodings.AddRangeAsync(codings);
    }

    private static async Task SeedOrdersAsync(CourseMateDbContext dbContext, List<Course> courses, List<Guid> studentIds)
    {
        if (courses.Count == 0 || studentIds.Count == 0)
        {
            return;
        }

        List<Course> toBuy = courses.Where(c => c.IsPublished).Take(3).ToList();
        if (toBuy.Count == 0)
        {
            toBuy = courses.Take(3).ToList();
        }

        List<Order> orders = [];
        List<OrderItem> orderItems = [];
        List<Enrollment> enrollments = [];

        foreach (Guid studentId in studentIds)
        {
            Guid orderId = Guid.NewGuid();
            decimal total = toBuy.Sum(c => c.Price);

            orders.Add(new Order(orderId, studentId, total, OrderStatus.Completed, "Đơn hàng mua khóa học"));

            foreach (Course course in toBuy)
            {
                orderItems.Add(new OrderItem(Guid.NewGuid(), orderId, course.Id, course.Price));
                enrollments.Add(new Enrollment(Guid.NewGuid(), studentId, course.Id));
            }
        }

        await dbContext.Orders.AddRangeAsync(orders);
        await dbContext.OrderItems.AddRangeAsync(orderItems);
        await dbContext.Enrollments.AddRangeAsync(enrollments);
    }
}