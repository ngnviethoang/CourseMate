using Newtonsoft.Json;

namespace CourseMate.Contracts.DTOs.Commons;

public class RunCodeResponse
{
    [JsonProperty("output")]
    public string? Output { get; set; }

    [JsonProperty("error")]
    public string? Error { get; set; }

    [JsonProperty("status")]
    public string? Status { get; set; }

    [JsonProperty("exit_code")]
    public int ExitCode { get; set; }

    [JsonProperty("signal")]
    public string? Signal { get; set; }

    [JsonProperty("time")]
    public string? Time { get; set; }

    [JsonProperty("total")]
    public string? Total { get; set; }

    [JsonProperty("memory")]
    public string? Memory { get; set; }
}