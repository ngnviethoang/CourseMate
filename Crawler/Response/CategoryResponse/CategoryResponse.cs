// Root myDeserializedClass = JsonSerializer.Deserialize<Root>(myJsonResponse);

using System.Text.Json.Serialization;

namespace Crawler.Response.CategoryResponse;

public class Datum
{
    [JsonPropertyName("id")]
    public int? Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("description")]
    public object Description { get; set; }

    [JsonPropertyName("priority")]
    public int? Priority { get; set; }

    [JsonPropertyName("multiLangData")]
    public List<MultiLangDatum> MultiLangData { get; set; }

    [JsonPropertyName("parentId")]
    public int? ParentId { get; set; }

    [JsonPropertyName("countCourse")]
    public int? CountCourse { get; set; }

    [JsonPropertyName("deleted")]
    public bool? Deleted { get; set; }

    [JsonPropertyName("createdOn")]
    public DateTime? CreatedOn { get; set; }

    [JsonPropertyName("modifiedOn")]
    public DateTime? ModifiedOn { get; set; }
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
    public object Description { get; set; }

    [JsonPropertyName("content")]
    public object Content { get; set; }
}

public class CategoryResponse
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
    public List<Datum> Data { get; set; }

    [JsonPropertyName("metaData")]
    public MetaData MetaData { get; set; }
}