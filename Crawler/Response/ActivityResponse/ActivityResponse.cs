using System.Text.Json.Serialization;

namespace Crawler.Response.ActivityResponse;

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

public class ActivityData
{
    [JsonPropertyName("activityId")]
    public int? ActivityId { get; set; }

    [JsonPropertyName("completionTracking")]
    public bool? CompletionTracking { get; set; }

    [JsonPropertyName("requireView")]
    public bool? RequireView { get; set; }

    [JsonPropertyName("requireEndReached")]
    public bool? RequireEndReached { get; set; }

    [JsonPropertyName("courseId")]
    public int? CourseId { get; set; }

    [JsonPropertyName("progressActivityStatus")]
    public int? ProgressActivityStatus { get; set; }

    [JsonPropertyName("activity")]
    public object Activity { get; set; }

    [JsonPropertyName("courseScheduleList")]
    public object CourseScheduleList { get; set; }

    [JsonPropertyName("permalink")]
    public object Permalink { get; set; }

    [JsonPropertyName("titleCourse")]
    public object TitleCourse { get; set; }

    [JsonPropertyName("owner")]
    public object Owner { get; set; }

    [JsonPropertyName("isEnrolled")]
    public bool? IsEnrolled { get; set; }

    [JsonPropertyName("isPublicView")]
    public bool? IsPublicView { get; set; }

    [JsonPropertyName("notHaveSchedule")]
    public bool? NotHaveSchedule { get; set; }
}

public class ActivityMultiLangDatum
{
    [JsonPropertyName("key")]
    public string Key { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; }

    [JsonPropertyName("summary")]
    public string Summary { get; set; }
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
    public object Summary { get; set; }

    [JsonPropertyName("scheduleStatus")]
    public int? ScheduleStatus { get; set; }

    [JsonPropertyName("sections")]
    public List<Section> Sections { get; set; }

    [JsonPropertyName("statisticSchedule")]
    public List<StatisticSchedule> StatisticSchedule { get; set; }
}

public class Data
{
    [JsonPropertyName("activitiesCompleted")]
    public List<object> ActivitiesCompleted { get; set; }

    [JsonPropertyName("activityId")]
    public int? ActivityId { get; set; }

    [JsonPropertyName("activityType")]
    public int? ActivityType { get; set; }

    [JsonPropertyName("activityMultiLangData")]
    public List<ActivityMultiLangDatum> ActivityMultiLangData { get; set; }

    [JsonPropertyName("userEnrollStartedTime")]
    public DateTime? UserEnrollStartedTime { get; set; }

    [JsonPropertyName("userEnrollDeadlineTime")]
    public object UserEnrollDeadlineTime { get; set; }

    [JsonPropertyName("scheduleActivity")]
    public ScheduleActivity ScheduleActivity { get; set; }

    [JsonPropertyName("activityData")]
    public ActivityData ActivityData { get; set; }

    [JsonPropertyName("titleCourse")]
    public string TitleCourse { get; set; }

    [JsonPropertyName("permalink")]
    public string Permalink { get; set; }

    [JsonPropertyName("courseOwner")]
    public object CourseOwner { get; set; }

    [JsonPropertyName("courseScheduleList")]
    public List<CourseScheduleList> CourseScheduleList { get; set; }

    [JsonPropertyName("progressActivityStatus")]
    public int? ProgressActivityStatus { get; set; }

    [JsonPropertyName("courseId")]
    public int? CourseId { get; set; }

    [JsonPropertyName("courseUsers")]
    public List<object> CourseUsers { get; set; }

    [JsonPropertyName("isEnrolled")]
    public bool? IsEnrolled { get; set; }

    [JsonPropertyName("isPublicView")]
    public bool? IsPublicView { get; set; }

    [JsonPropertyName("isAdminContext")]
    public bool? IsAdminContext { get; set; }

    [JsonPropertyName("allowPreview")]
    public bool? AllowPreview { get; set; }

    [JsonPropertyName("externalCode")]
    public string ExternalCode { get; set; }

    [JsonPropertyName("userEnrollStatus")]
    public int? UserEnrollStatus { get; set; }
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

public class MultiLangDatum
{
    [JsonPropertyName("key")]
    public string Key { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; }

    [JsonPropertyName("summary")]
    public string Summary { get; set; }
}

public class ActivityResponse
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

public class ScheduleActivity
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