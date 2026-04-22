using Newtonsoft.Json;

namespace CourseMate.Contracts.DTOs;

public class CompilerInfo
{
    [JsonProperty("id")]
    public string? Id { get; set; }

    [JsonProperty("name")]
    public string? Name { get; set; }
}