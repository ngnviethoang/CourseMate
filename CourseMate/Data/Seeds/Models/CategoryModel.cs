using System.Text.Json.Serialization;

namespace CourseMate.Data.Seeds.Models;

public class CategoryModel
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("priority")]
    public int Priority { get; set; }

    [JsonPropertyName("multiLangData")]
    public List<MultiLangDatum> MultiLangData { get; set; }

    [JsonPropertyName("parentId")]
    public int ParentId { get; set; }

    [JsonPropertyName("countCourse")]
    public int CountCourse { get; set; }

    [JsonPropertyName("deleted")]
    public bool Deleted { get; set; }

    [JsonPropertyName("createdOn")]
    public DateTime CreatedOn { get; set; }

    [JsonPropertyName("modifiedOn")]
    public DateTime ModifiedOn { get; set; }
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
    public string Content { get; set; }
}