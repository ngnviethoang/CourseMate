using Newtonsoft.Json;

namespace CourseMate.Contracts.DTOs;

public class OnlineCompilerRunRequest
{
    [JsonProperty("code")]
    public string? Code { get; set; }

    [JsonProperty("compiler")]
    public string? Compiler { get; set; }

    [JsonProperty("input")]
    public string? Input { get; set; }
}