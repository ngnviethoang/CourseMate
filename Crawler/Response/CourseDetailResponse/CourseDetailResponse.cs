using System.Text.Json.Serialization;

namespace Crawler.Response.CourseDetailResponse;

public class CourseDetailResponse
{
    [JsonPropertyName("success")]
    public bool? Success { get; set; }

    [JsonPropertyName("message")]
    public string Message { get; set; }

    [JsonPropertyName("code")]
    public int? Code { get; set; }

    [JsonPropertyName("callBackFunction")]
    public object CallBackFunction { get; set; }

    [JsonPropertyName("data")]
    public Data Data { get; set; }

    [JsonPropertyName("metaData")]
    public MetaData MetaData { get; set; }
}

public class Activity
{
    [JsonPropertyName("sectionId")]
    public object SectionId { get; set; }

    [JsonPropertyName("sectionName")]
    public object SectionName { get; set; }

    [JsonPropertyName("activityId")]
    public int? ActivityId { get; set; }

    [JsonPropertyName("activityTitle")]
    public string ActivityTitle { get; set; }

    [JsonPropertyName("duration")]
    public int? Duration { get; set; }

    [JsonPropertyName("priority")]
    public int? Priority { get; set; }

    [JsonPropertyName("sectionPriority")]
    public int? SectionPriority { get; set; }

    [JsonPropertyName("activityType")]
    public int? ActivityType { get; set; }

    [JsonPropertyName("activityStatus")]
    public int? ActivityStatus { get; set; }

    [JsonPropertyName("major")]
    public bool? Major { get; set; }

    [JsonPropertyName("allowPreview")]
    public bool? AllowPreview { get; set; }

    [JsonPropertyName("multiLangData")]
    public List<MultiLangDatum> MultiLangData { get; set; }
}

public class CourseSchedule
{
    [JsonPropertyName("courseScheduleList")]
    public List<CourseScheduleList> CourseScheduleList { get; set; }

    [JsonPropertyName("permalink")]
    public string Permalink { get; set; }

    [JsonPropertyName("titleCourse")]
    public string TitleCourse { get; set; }

    [JsonPropertyName("owner")]
    public Owner Owner { get; set; }

    [JsonPropertyName("isEnrolled")]
    public bool? IsEnrolled { get; set; }

    [JsonPropertyName("isPublicView")]
    public bool? IsPublicView { get; set; }

    [JsonPropertyName("notHaveSchedule")]
    public bool? NotHaveSchedule { get; set; }
}

public class CourseScheduleList
{
    [JsonPropertyName("scheduleTitle")]
    public string ScheduleTitle { get; set; }

    [JsonPropertyName("scheduleUniqueId")]
    public string ScheduleUniqueId { get; set; }

    [JsonPropertyName("scheduleUnit")]
    public int? ScheduleUnit { get; set; }

    [JsonPropertyName("duration")]
    public int? Duration { get; set; }

    [JsonPropertyName("summary")]
    public string Summary { get; set; }

    [JsonPropertyName("scheduleStatus")]
    public int? ScheduleStatus { get; set; }

    [JsonPropertyName("sections")]
    public List<Section> Sections { get; set; }

    [JsonPropertyName("statisticSchedule")]
    public List<StatisticSchedule> StatisticSchedule { get; set; }
}

public class CourseUser
{
    [JsonPropertyName("id")]
    public int? Id { get; set; }

    [JsonPropertyName("courseId")]
    public int? CourseId { get; set; }

    [JsonPropertyName("userId")]
    public int? UserId { get; set; }

    [JsonPropertyName("value")]
    public int? Value { get; set; }

    [JsonPropertyName("role")]
    public int? Role { get; set; }

    [JsonPropertyName("isDeleted")]
    public bool? IsDeleted { get; set; }

    [JsonPropertyName("username")]
    public string Username { get; set; }
}

public class Data
{
    [JsonPropertyName("id")]
    public int? Id { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; }

    [JsonPropertyName("permalink")]
    public string Permalink { get; set; }

    [JsonPropertyName("thumbnail")]
    public string Thumbnail { get; set; }

    [JsonPropertyName("summary")]
    public string Summary { get; set; }

    [JsonPropertyName("externalcode")]
    public string Externalcode { get; set; }

    [JsonPropertyName("courseLevel")]
    public int? CourseLevel { get; set; }

    [JsonPropertyName("isPass")]
    public bool? IsPass { get; set; }

    [JsonPropertyName("objectives")]
    public List<string> Objectives { get; set; }

    [JsonPropertyName("skill")]
    public List<string> Skill { get; set; }

    [JsonPropertyName("schedule")]
    public object Schedule { get; set; }

    [JsonPropertyName("courseSchedule")]
    public CourseSchedule CourseSchedule { get; set; }

    [JsonPropertyName("duration")]
    public int? Duration { get; set; }

    [JsonPropertyName("about")]
    public string About { get; set; }

    [JsonPropertyName("totalStudent")]
    public int? TotalStudent { get; set; }

    [JsonPropertyName("owner")]
    public Owner Owner { get; set; }

    [JsonPropertyName("isEnroll")]
    public bool? IsEnroll { get; set; }

    [JsonPropertyName("progress")]
    public int? Progress { get; set; }

    [JsonPropertyName("percentageToComplete")]
    public int? PercentageToComplete { get; set; }

    [JsonPropertyName("createdUtc")]
    public object CreatedUtc { get; set; }

    [JsonPropertyName("startTime")]
    public DateTime? StartTime { get; set; }

    [JsonPropertyName("endTime")]
    public DateTime? EndTime { get; set; }

    [JsonPropertyName("finishedTime")]
    public object FinishedTime { get; set; }

    [JsonPropertyName("enrolmentUniqueId")]
    public string EnrolmentUniqueId { get; set; }

    [JsonPropertyName("enrollStatus")]
    public int? EnrollStatus { get; set; }

    [JsonPropertyName("price")]
    public int? Price { get; set; }

    [JsonPropertyName("isPayment")]
    public bool? IsPayment { get; set; }

    [JsonPropertyName("discount")]
    public int? Discount { get; set; }

    [JsonPropertyName("isCombo")]
    public bool? IsCombo { get; set; }

    [JsonPropertyName("courseViewLimit")]
    public int? CourseViewLimit { get; set; }

    [JsonPropertyName("courseEnrollLimit")]
    public int? CourseEnrollLimit { get; set; }

    [JsonPropertyName("allowUnenroll")]
    public bool? AllowUnenroll { get; set; }

    [JsonPropertyName("versions")]
    public object Versions { get; set; }

    [JsonPropertyName("courseUsers")]
    public List<CourseUser> CourseUsers { get; set; }

    [JsonPropertyName("providerId")]
    public int? ProviderId { get; set; }

    [JsonPropertyName("providerName")]
    public string ProviderName { get; set; }

    [JsonPropertyName("providerThumbnail")]
    public string ProviderThumbnail { get; set; }

    [JsonPropertyName("courseLimit")]
    public object CourseLimit { get; set; }

    [JsonPropertyName("multiLangData")]
    public List<MultiLangDatum> MultiLangData { get; set; }

    [JsonPropertyName("courseId")]
    public int? CourseId { get; set; }

    [JsonPropertyName("totalComment")]
    public int? TotalComment { get; set; }

    [JsonPropertyName("enrollStartTime")]
    public object EnrollStartTime { get; set; }

    [JsonPropertyName("enrollDeadlineTime")]
    public object EnrollDeadlineTime { get; set; }

    [JsonPropertyName("userInfo")]
    public object UserInfo { get; set; }

    [JsonPropertyName("label")]
    public int? Label { get; set; }

    [JsonPropertyName("httpCode")]
    public int? HttpCode { get; set; }

    [JsonPropertyName("subCourses")]
    public object SubCourses { get; set; }

    [JsonPropertyName("isOrgManager")]
    public bool? IsOrgManager { get; set; }

    [JsonPropertyName("isAddToCart")]
    public bool? IsAddToCart { get; set; }

    [JsonPropertyName("priceAfterDiscount")]
    public int? PriceAfterDiscount { get; set; }

    [JsonPropertyName("averageRate")]
    public int? AverageRate { get; set; }

    [JsonPropertyName("tags")]
    public List<string> Tags { get; set; }

    [JsonPropertyName("learnDuration")]
    public int? LearnDuration { get; set; }

    [JsonPropertyName("catalogs")]
    public List<string> Catalogs { get; set; }
}

public class MultiLangDatum
{
    [JsonPropertyName("key")]
    public string Key { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; }

    [JsonPropertyName("content")]
    public object Content { get; set; }

    [JsonPropertyName("objective")]
    public object Objective { get; set; }

    [JsonPropertyName("permalink")]
    public string Permalink { get; set; }

    [JsonPropertyName("document")]
    public object Document { get; set; }

    [JsonPropertyName("about")]
    public string About { get; set; }

    [JsonPropertyName("summary")]
    public string Summary { get; set; }

    [JsonPropertyName("objectives")]
    public List<string> Objectives { get; set; }

    [JsonPropertyName("skills")]
    public List<string> Skills { get; set; }
}

public class Section
{
    [JsonPropertyName("sectionId")]
    public int? SectionId { get; set; }

    [JsonPropertyName("sectionName")]
    public string SectionName { get; set; }

    [JsonPropertyName("sectionStatus")]
    public int? SectionStatus { get; set; }

    [JsonPropertyName("activities")]
    public List<Activity> Activities { get; set; }
}

public class StatisticSchedule
{
    [JsonPropertyName("activityType")]
    public int? ActivityType { get; set; }

    [JsonPropertyName("activityDuration")]
    public int? ActivityDuration { get; set; }

    [JsonPropertyName("totalLesson")]
    public int? TotalLesson { get; set; }
}

public class MetaData
{
    [JsonPropertyName("total")]
    public int? Total { get; set; }

    [JsonPropertyName("pageTotal")]
    public int? PageTotal { get; set; }

    [JsonPropertyName("pageSize")]
    public int? PageSize { get; set; }

    [JsonPropertyName("pageIndex")]
    public int? PageIndex { get; set; }

    [JsonPropertyName("data")]
    public object Data { get; set; }
}

public class Owner
{
    [JsonPropertyName("userId")]
    public int? UserId { get; set; }

    [JsonPropertyName("userName")]
    public string UserName { get; set; }

    [JsonPropertyName("displayName")]
    public string DisplayName { get; set; }
}