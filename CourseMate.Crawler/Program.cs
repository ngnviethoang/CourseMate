using System.Text;
using System.Text.Json;
using CourseMate.Crawler;
using CourseMate.Crawler.Response.ActivityResponse;
using CourseMate.Crawler.Response.CourseDetailResponse;
using CourseMate.Crawler.Response.CourseListReponse;

Console.OutputEncoding = Encoding.UTF8;

await FormatJson.Handle();
return;
HttpClient client = new();

// Tạo thư mục lưu dữ liệu
string baseDir = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "Data"));
Directory.CreateDirectory(baseDir);
string activityDir = Path.Combine(baseDir, "Activities");
Directory.CreateDirectory(activityDir);

// Lấy danh sách khóa học
Console.WriteLine("📥 Đang tải danh sách khóa học...");
HttpResponseMessage response = await client.GetAsync("https://api.codelearn.io/learn/course/get-course-list?keyword=&courseState=0&courseViewLimit=&pageIndex=1&pageSize=100&categoryId=");
response.EnsureSuccessStatusCode();
string courseListJson = await response.Content.ReadAsStringAsync();
await File.WriteAllTextAsync(Path.Combine(baseDir, "courseList.json"), courseListJson);

CourseListReponse? courseList = JsonSerializer.Deserialize<CourseListReponse>(courseListJson, new JsonSerializerOptions
{
    PropertyNameCaseInsensitive = true
});

if (courseList == null || courseList.Data == null)
{
    Console.WriteLine("❌ Không thể đọc danh sách khóa học.");
    return;
}

// Khai báo list để lưu dữ liệu
List<CourseDetailResponse> courseDetails = new();
List<ActivityResponse> activities = new();
int index = 1;
foreach (Datum datum in courseList.Data)
{
    Console.WriteLine($"\n➡️ [{index}/{courseList.Data.Count}] Đang xử lý: {datum.Title} (ID: {datum.Id})");

    try
    {
        response = await client.GetAsync($"https://api.codelearn.io/learn/course/get-personal-courses-detail?permalink={datum.Permalink}");
        response.EnsureSuccessStatusCode();
        string detailJson = await response.Content.ReadAsStringAsync();

        CourseDetailResponse? detail = JsonSerializer.Deserialize<CourseDetailResponse>(detailJson, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        if (detail != null)
        {
            courseDetails.Add(detail);
            Console.WriteLine($"✅ Đã thêm chi tiết: {datum.Title}");

            // Lấy danh sách activity
            List<int?> activityIds = detail.Data.CourseSchedule.CourseScheduleList
                .SelectMany(i => i.Sections)
                .SelectMany(i => i.Activities)
                .Select(i => i.ActivityId)
                .Where(id => id.HasValue)
                .Distinct()
                .ToList();

            Console.WriteLine($"🧩  > Tổng số activity: {activityIds.Count}");

            foreach (int? activityId in activityIds)
            {
                try
                {
                    response = await client.GetAsync($"https://api.codelearn.io/learn/coding/getusercodeactivity?activityId={activityId}&permalink={datum.Permalink}&contextType=1");
                    response.EnsureSuccessStatusCode();
                    string json2 = await response.Content.ReadAsStringAsync();
                    ActivityResponse? activity = JsonSerializer.Deserialize<ActivityResponse>(json2, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    if (activity != null)
                    {
                        activities.Add(activity);
                        Console.WriteLine($"     ✅ Activity ID {activityId} OK");
                    }
                    else
                    {
                        Console.WriteLine($"     ⚠️ Không parse được activity ID: {activityId}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"     ❌ Lỗi activity {activityId}: {ex.Message}");
                }
            }

            // Ghi riêng từng danh sách activity theo permalink
            if (activities.Count > 0)
            {
                string fileName = $"activity_{datum.Permalink}.json";
                string filePath = Path.Combine(activityDir, fileName);
                string activityJson = JsonSerializer.Serialize(activities, new JsonSerializerOptions { WriteIndented = true });
                await File.WriteAllTextAsync(filePath, activityJson);
                Console.WriteLine($"📁 Đã ghi activities của {datum.Permalink} vào: {filePath}");
            }
        }
        else
        {
            Console.WriteLine($"⚠️ Không parse được chi tiết cho: {datum.Title}");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Lỗi khi lấy chi tiết {datum.Title}: {ex.Message}");
    }

    index++;
}

// Ghi toàn bộ chi tiết khóa học
string courseDetailsPath = Path.Combine(baseDir, "courseDetails.json");
string detailsJson = JsonSerializer.Serialize(courseDetails, new JsonSerializerOptions { WriteIndented = true });
await File.WriteAllTextAsync(courseDetailsPath, detailsJson);
Console.WriteLine($"📁 Đã ghi toàn bộ courseDetails vào: {courseDetailsPath}");

string activityPath = Path.Combine(baseDir, "activities.json");
string activitiesJson = JsonSerializer.Serialize(activities, new JsonSerializerOptions { WriteIndented = true });
await File.WriteAllTextAsync(activityPath, activitiesJson);
Console.WriteLine($"📁 Đã ghi toàn bộ activities vào: {activityPath}");