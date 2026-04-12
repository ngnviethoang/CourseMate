using System.Text;
using CourseMate.Contracts.Options;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace CourseMate.Application.Services.CodeRunners;

public class RapidService : ICodeRunnerService
{
    private readonly RapidOptions _rapidOptions;

    public RapidService(IOptions<RapidOptions> rapidOptions)
    {
        _rapidOptions = rapidOptions.Value;
    }

    public async Task<string> RunAsync(string code, string language, CancellationToken cancellationToken)
    {
        string url = _rapidOptions.Url.TrimEnd('/');
        using HttpClient client = new();

        PayloadDto payload = new(code, language);
        StringContent requestContent = new(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");

        client.DefaultRequestHeaders.Add("x-rapidapi-key", _rapidOptions.ApiKey);
        client.DefaultRequestHeaders.Add("x-rapidapi-host", url);

        HttpResponseMessage response = await client.PostAsync($"{url}/run_code", requestContent, cancellationToken);
        response.EnsureSuccessStatusCode();
        string body = await response.Content.ReadAsStringAsync(cancellationToken);
        ResultDto? bodyObject = JsonConvert.DeserializeObject<ResultDto>(body);
        return bodyObject?.Output ?? string.Empty;
    }

    private record PayloadDto(string Code, string Language);

    private class ResultDto
    {
        [JsonProperty("output")]
        public string? Output { get; set; }

        [JsonProperty("extra_response_instructions")]
        public string? ExtraResponseInstructions { get; set; }
    }
}