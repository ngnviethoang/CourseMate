using Newtonsoft.Json;

namespace CourseMate.Contracts.DTOs;

public class OnlineCompilerResponse
{
    [JsonProperty("compilers")]
    public List<CompilerInfo> Compilers { get; set; } = [];
}