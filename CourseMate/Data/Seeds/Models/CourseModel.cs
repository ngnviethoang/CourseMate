using System.Text.Json.Serialization;

namespace CourseMate.Data.Seeds.Models;

public class CourseModel
{
    [JsonPropertyName("isCompleted")]
    public bool? IsCompleted { get; set; }

    [JsonPropertyName("isSuggested")]
    public bool IsSuggested { get; set; }

    [JsonPropertyName("isCreated")]
    public bool IsCreated { get; set; }

    [JsonPropertyName("discountPercent")]
    public int DiscountPercent { get; set; }

    [JsonPropertyName("studyMode")]
    public int StudyMode { get; set; }

    [JsonPropertyName("userName")]
    public string UserName { get; set; }

    [JsonPropertyName("email")]
    public string Email { get; set; }

    [JsonPropertyName("avatarUrl")]
    public string AvatarUrl { get; set; }

    [JsonPropertyName("totalEnroll")]
    public int TotalEnroll { get; set; }

    [JsonPropertyName("totalStudent")]
    public int TotalStudent { get; set; }

    [JsonPropertyName("totalPass")]
    public int TotalPass { get; set; }

    [JsonPropertyName("totalRate")]
    public int TotalRate { get; set; }

    [JsonPropertyName("averageRate")]
    public double AverageRate { get; set; }

    [JsonPropertyName("isEnroll")]
    public bool IsEnroll { get; set; }

    [JsonPropertyName("progress")]
    public int Progress { get; set; }

    [JsonPropertyName("userEnrollUniqueId")]
    public string UserEnrollUniqueId { get; set; }

    [JsonPropertyName("isNew")]
    public bool IsNew { get; set; }

    [JsonPropertyName("isHot")]
    public bool IsHot { get; set; }

    [JsonPropertyName("isBest")]
    public bool IsBest { get; set; }

    [JsonPropertyName("isPopular")]
    public bool IsPopular { get; set; }

    [JsonPropertyName("startTime")]
    public DateTime StartTime { get; set; }

    [JsonPropertyName("finishedTime")]
    public DateTime FinishedTime { get; set; }

    [JsonPropertyName("isPass")]
    public bool IsPass { get; set; }

    [JsonPropertyName("isCombo")]
    public bool IsCombo { get; set; }

    /*[JsonPropertyName("subCourseCombos")]
    [NotMapped]
    public List<object> SubCourseCombos { get; set; }*/

    [JsonPropertyName("objectives")]
    public List<string> Objectives { get; set; }

    [JsonPropertyName("skill")]
    public List<string> Skill { get; set; }

    [JsonPropertyName("deleted")]
    public bool Deleted { get; set; }

    [JsonPropertyName("courseStatus")]
    public string CourseStatus { get; set; }

    [JsonPropertyName("courseLevel")]
    public int CourseLevel { get; set; }

    [JsonPropertyName("userEnrollStatus")]
    public int UserEnrollStatus { get; set; }

    [JsonPropertyName("userEnrollStartedTime")]
    public object UserEnrollStartedTime { get; set; }

    [JsonPropertyName("userEnrollDeadlineTime")]
    public object UserEnrollDeadlineTime { get; set; }

    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("categoryId")]
    public int CategoryId { get; set; }

    [JsonPropertyName("title")]
    public string? Title { get; set; }

    [JsonPropertyName("permalink")]
    public string Permalink { get; set; }

    /*[JsonPropertyName("multiLangData")]
    [NotMapped]
    public List<object> MultiLangData { get; set; }*/

    [JsonPropertyName("thumbnail")]
    public string? Thumbnail { get; set; }

    [JsonPropertyName("summary")]
    public string? Summary { get; set; }

    [JsonPropertyName("objective")]
    public string Objective { get; set; }

    [JsonPropertyName("price")]
    public int Price { get; set; }

    [JsonPropertyName("discount")]
    public int Discount { get; set; }

    [JsonPropertyName("priceAfterDiscount")]
    public int PriceAfterDiscount { get; set; }

    [JsonPropertyName("estimateTimeComplete")]
    public int EstimateTimeComplete { get; set; }

    [JsonPropertyName("totalActivity")]
    public int TotalActivity { get; set; }

    [JsonPropertyName("percentageToComplete")]
    public int PercentageToComplete { get; set; }

    [JsonPropertyName("courseViewLimit")]
    public int CourseViewLimit { get; set; }

    [JsonPropertyName("courseEnrollLimit")]
    public int CourseEnrollLimit { get; set; }

    [JsonPropertyName("owner")]
    public Owner Owner { get; set; }

    [JsonPropertyName("courseId")]
    public int CourseId { get; set; }

    [JsonPropertyName("externalCode")]
    public string ExternalCode { get; set; }

    [JsonPropertyName("label")]
    public int Label { get; set; }

    [JsonPropertyName("createdOn")]
    public DateTime CreatedOn { get; set; }

    [JsonPropertyName("learnDuration")]
    public int? LearnDuration { get; set; }

    [JsonPropertyName("catalogs")]
    public List<string> Catalogs { get; set; }
}

public class Owner
{
    [JsonPropertyName("userId")]
    public int UserId { get; set; }

    [JsonPropertyName("userName")]
    public string UserName { get; set; }

    [JsonPropertyName("displayName")]
    public string DisplayName { get; set; }
}