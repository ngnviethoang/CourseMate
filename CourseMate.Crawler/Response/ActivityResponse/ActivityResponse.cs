using System.Text.Json.Serialization;

namespace CourseMate.Crawler.Response.ActivityResponse;

public class ActivitiesRelatedOfChapter
{
    [JsonPropertyName("id")]
    public int? Id { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; }

    [JsonPropertyName("sectionId")]
    public int? SectionId { get; set; }

    [JsonPropertyName("activityType")]
    public int? ActivityType { get; set; }

    [JsonPropertyName("duration")]
    public int? Duration { get; set; }
}

public class Activity
{
    [JsonPropertyName("courseId")]
    public int? CourseId { get; set; }

    [JsonPropertyName("id")]
    public int? Id { get; set; }

    [JsonPropertyName("sectionId")]
    public int? SectionId { get; set; }

    [JsonPropertyName("isMajorActivity")]
    public bool? IsMajorActivity { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; }

    [JsonPropertyName("permalink")]
    public object Permalink { get; set; }

    [JsonPropertyName("priority")]
    public int? Priority { get; set; }

    [JsonPropertyName("externalCode")]
    public string ExternalCode { get; set; }

    [JsonPropertyName("activityType")]
    public int? ActivityType { get; set; }

    [JsonPropertyName("descriptionDisplayOnCourse")]
    public bool? DescriptionDisplayOnCourse { get; set; }

    [JsonPropertyName("availability")]
    public int? Availability { get; set; }

    [JsonPropertyName("duration")]
    public int? Duration { get; set; }

    [JsonPropertyName("multiLangData")]
    public List<MultiLangDatum> MultiLangData { get; set; }

    [JsonPropertyName("allowPreview")]
    public bool? AllowPreview { get; set; }
}

public class Activity2
{
    [JsonPropertyName("id")]
    public int? Id { get; set; }

    [JsonPropertyName("ownerId")]
    public int? OwnerId { get; set; }

    [JsonPropertyName("courseId")]
    public int? CourseId { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; }

    [JsonPropertyName("tags")]
    public string Tags { get; set; }

    [JsonPropertyName("owner")]
    public Owner Owner { get; set; }

    [JsonPropertyName("activityType")]
    public int? ActivityType { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; }

    [JsonPropertyName("descriptionEncode")]
    public object DescriptionEncode { get; set; }

    [JsonPropertyName("summary")]
    public string Summary { get; set; }

    [JsonPropertyName("sectionId")]
    public int? SectionId { get; set; }

    [JsonPropertyName("externalCode")]
    public string ExternalCode { get; set; }

    [JsonPropertyName("duration")]
    public int? Duration { get; set; }

    [JsonPropertyName("multiLangData")]
    public List<MultiLangDatum> MultiLangData { get; set; }

    [JsonPropertyName("allowPreview")]
    public bool? AllowPreview { get; set; }

    [JsonPropertyName("activityUsers")]
    public object ActivityUsers { get; set; }
}

public class CodeActivity
{
    [JsonPropertyName("activityId")]
    public int? ActivityId { get; set; }

    [JsonPropertyName("activityType")]
    public int? ActivityType { get; set; }

    [JsonPropertyName("activityCodeSubType")]
    public int? ActivityCodeSubType { get; set; }

    [JsonPropertyName("generationCodeType")]
    public string GenerationCodeType { get; set; }

    [JsonPropertyName("codeSample")]
    public string CodeSample { get; set; }

    [JsonPropertyName("functionName")]
    public string FunctionName { get; set; }

    [JsonPropertyName("extenalCompilerURL")]
    public string ExtenalCompilerURL { get; set; }

    [JsonPropertyName("extenalCompilerType")]
    public int? ExtenalCompilerType { get; set; }

    [JsonPropertyName("verifyCode")]
    public string VerifyCode { get; set; }

    [JsonPropertyName("point")]
    public int? Point { get; set; }

    [JsonPropertyName("limitNumberSubmission")]
    public int? LimitNumberSubmission { get; set; }

    [JsonPropertyName("limitCodeCharacter")]
    public int? LimitCodeCharacter { get; set; }

    [JsonPropertyName("level")]
    public string Level { get; set; }

    [JsonPropertyName("maxMemory")]
    public int? MaxMemory { get; set; }

    [JsonPropertyName("outputType")]
    public string OutputType { get; set; }

    [JsonPropertyName("programingLanguages")]
    public List<string> ProgramingLanguages { get; set; }

    [JsonPropertyName("listCodeTemplates")]
    public List<ListCodeTemplate> ListCodeTemplates { get; set; }

    [JsonPropertyName("listInputs")]
    public object ListInputs { get; set; }

    [JsonPropertyName("activity")]
    public Activity Activity { get; set; }

    [JsonPropertyName("oopActivity")]
    public object OopActivity { get; set; }

    [JsonPropertyName("listTestCase")]
    public List<ListTestCase> ListTestCase { get; set; }
}

public class ContextDetail
{
    [JsonPropertyName("chapterName")]
    public string ChapterName { get; set; }

    [JsonPropertyName("activitiesRelatedOfChapter")]
    public List<ActivitiesRelatedOfChapter> ActivitiesRelatedOfChapter { get; set; }

    [JsonPropertyName("contextId")]
    public int? ContextId { get; set; }

    [JsonPropertyName("scheduleId")]
    public string ScheduleId { get; set; }

    [JsonPropertyName("ownerId")]
    public int? OwnerId { get; set; }

    [JsonPropertyName("contextName")]
    public string ContextName { get; set; }

    [JsonPropertyName("contextPermalink")]
    public string ContextPermalink { get; set; }

    [JsonPropertyName("contextIsDependencies")]
    public bool? ContextIsDependencies { get; set; }

    [JsonPropertyName("sectionsInCurrentSchedule")]
    public List<SectionsInCurrentSchedule> SectionsInCurrentSchedule { get; set; }

    [JsonPropertyName("courseViewLimit")]
    public int? CourseViewLimit { get; set; }

    [JsonPropertyName("courseEnrollLimit")]
    public int? CourseEnrollLimit { get; set; }

    [JsonPropertyName("priceAfterDiscount")]
    public int? PriceAfterDiscount { get; set; }
}

public class Data
{
    [JsonPropertyName("contextDetail")]
    public ContextDetail ContextDetail { get; set; }

    [JsonPropertyName("codeActivity")]
    public CodeActivity CodeActivity { get; set; }

    [JsonPropertyName("activitiesCompleted")]
    public object ActivitiesCompleted { get; set; }

    [JsonPropertyName("activitiesFailed")]
    public object ActivitiesFailed { get; set; }

    [JsonPropertyName("languagesCodeSubmitted")]
    public object LanguagesCodeSubmitted { get; set; }

    [JsonPropertyName("totalSubmitted")]
    public int? TotalSubmitted { get; set; }

    [JsonPropertyName("lastTriedTActivityId")]
    public int? LastTriedTActivityId { get; set; }

    [JsonPropertyName("isAdminContext")]
    public bool? IsAdminContext { get; set; }

    [JsonPropertyName("totalComment")]
    public int? TotalComment { get; set; }

    [JsonPropertyName("isEnrolled")]
    public bool? IsEnrolled { get; set; }

    [JsonPropertyName("isPublicView")]
    public bool? IsPublicView { get; set; }

    [JsonPropertyName("hasSolution")]
    public bool? HasSolution { get; set; }

    [JsonPropertyName("userEnrollStartedTime")]
    public object UserEnrollStartedTime { get; set; }

    [JsonPropertyName("userEnrollDeadlineTime")]
    public object UserEnrollDeadlineTime { get; set; }

    [JsonPropertyName("userEnrollStatus")]
    public object UserEnrollStatus { get; set; }
}

public class ListCodeTemplate
{
    [JsonPropertyName("languageKey")]
    public string LanguageKey { get; set; }

    [JsonPropertyName("codeContent")]
    public string CodeContent { get; set; }

    [JsonPropertyName("functionName")]
    public string FunctionName { get; set; }
}

public class ListTestCase
{
    [JsonPropertyName("id")]
    public int? Id { get; set; }

    [JsonPropertyName("orderBy")]
    public int? OrderBy { get; set; }

    [JsonPropertyName("activityId")]
    public int? ActivityId { get; set; }

    [JsonPropertyName("input")]
    public string Input { get; set; }

    [JsonPropertyName("output")]
    public string Output { get; set; }

    [JsonPropertyName("executeLimitTime")]
    public int? ExecuteLimitTime { get; set; }

    [JsonPropertyName("title")]
    public object Title { get; set; }

    [JsonPropertyName("content")]
    public object Content { get; set; }

    [JsonPropertyName("errorMessage")]
    public object ErrorMessage { get; set; }

    [JsonPropertyName("isHidden")]
    public bool? IsHidden { get; set; }

    [JsonPropertyName("cssCompletePercent")]
    public object CssCompletePercent { get; set; }
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

public class Owner
{
    [JsonPropertyName("id")]
    public int? Id { get; set; }

    [JsonPropertyName("userId")]
    public int? UserId { get; set; }

    [JsonPropertyName("email")]
    public string Email { get; set; }

    [JsonPropertyName("userName")]
    public string UserName { get; set; }

    [JsonPropertyName("displayName")]
    public string DisplayName { get; set; }

    [JsonPropertyName("fullName")]
    public string FullName { get; set; }

    [JsonPropertyName("createdUtc")]
    public DateTime? CreatedUtc { get; set; }

    [JsonPropertyName("birthYear")]
    public DateTime? BirthYear { get; set; }

    [JsonPropertyName("phoneNumber")]
    public string PhoneNumber { get; set; }

    [JsonPropertyName("isVerifiedPhoneNumber")]
    public bool? IsVerifiedPhoneNumber { get; set; }

    [JsonPropertyName("cityName")]
    public string CityName { get; set; }

    [JsonPropertyName("graduatedSchool")]
    public string GraduatedSchool { get; set; }

    [JsonPropertyName("major")]
    public string Major { get; set; }

    [JsonPropertyName("grade")]
    public string Grade { get; set; }

    [JsonPropertyName("collegeId")]
    public int? CollegeId { get; set; }

    [JsonPropertyName("avatarUrl")]
    public string AvatarUrl { get; set; }

    [JsonPropertyName("countryName")]
    public string CountryName { get; set; }

    [JsonPropertyName("countryIconUrl")]
    public string CountryIconUrl { get; set; }

    [JsonPropertyName("userExpLevel")]
    public UserExpLevel UserExpLevel { get; set; }

    [JsonPropertyName("lpInfo")]
    public object LpInfo { get; set; }

    [JsonPropertyName("isContributor")]
    public bool? IsContributor { get; set; }

    [JsonPropertyName("lastLoginUtc")]
    public object LastLoginUtc { get; set; }

    [JsonPropertyName("summary")]
    public string Summary { get; set; }

    [JsonPropertyName("achievement")]
    public string Achievement { get; set; }

    [JsonPropertyName("facebook")]
    public string Facebook { get; set; }

    [JsonPropertyName("linkedIn")]
    public string LinkedIn { get; set; }

    [JsonPropertyName("twitter")]
    public string Twitter { get; set; }

    [JsonPropertyName("countryId")]
    public int? CountryId { get; set; }

    [JsonPropertyName("stateId")]
    public int? StateId { get; set; }

    [JsonPropertyName("districtId")]
    public int? DistrictId { get; set; }

    [JsonPropertyName("numberChanged")]
    public int? NumberChanged { get; set; }

    [JsonPropertyName("approvedEmail")]
    public bool? ApprovedEmail { get; set; }

    [JsonPropertyName("provinceName")]
    public string ProvinceName { get; set; }

    [JsonPropertyName("districtName")]
    public object DistrictName { get; set; }

    [JsonPropertyName("preferLanguages")]
    public object PreferLanguages { get; set; }

    [JsonPropertyName("preferSkills")]
    public object PreferSkills { get; set; }
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

public class SectionsInCurrentSchedule
{
    [JsonPropertyName("id")]
    public int? Id { get; set; }

    [JsonPropertyName("externalId")]
    public string ExternalId { get; set; }

    [JsonPropertyName("courseId")]
    public int? CourseId { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; }

    [JsonPropertyName("priority")]
    public int? Priority { get; set; }

    [JsonPropertyName("activities")]
    public List<Activity> Activities { get; set; }

    [JsonPropertyName("scheduleUniqueId")]
    public string ScheduleUniqueId { get; set; }

    [JsonPropertyName("descripton")]
    public object Descripton { get; set; }

    [JsonPropertyName("multiLangData")]
    public List<object> MultiLangData { get; set; }
}

public class UserExpLevel
{
    [JsonPropertyName("userLevelId")]
    public int? UserLevelId { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("iconUrl")]
    public string IconUrl { get; set; }

    [JsonPropertyName("levelNo")]
    public int? LevelNo { get; set; }

    [JsonPropertyName("absoluteExperiencePoint")]
    public int? AbsoluteExperiencePoint { get; set; }

    [JsonPropertyName("currentUserExperiencePoint")]
    public int? CurrentUserExperiencePoint { get; set; }

    [JsonPropertyName("relativeExperiencePoint")]
    public int? RelativeExperiencePoint { get; set; }

    [JsonPropertyName("nextLevelExp")]
    public int? NextLevelExp { get; set; }

    [JsonPropertyName("nextLevelIconUrl")]
    public string NextLevelIconUrl { get; set; }

    [JsonPropertyName("defaultUserAvatarUrl")]
    public string DefaultUserAvatarUrl { get; set; }
}