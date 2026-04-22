using System.Text;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Exceptions;
using CourseMate.Contracts.Options;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace CourseMate.Application.Services.CodeRunners;

public class OnlineCompilerService : ICodeRunnerService
{
    private readonly HttpClient _httpClient;
    private readonly OnlineCompilerOptions _onlineCompilerOptions;

    public OnlineCompilerService(IOptions<OnlineCompilerOptions> options, HttpClient httpClient)
    {
        _onlineCompilerOptions = options.Value;
        _httpClient = httpClient;
    }

    public async Task<RunCodeResponse> RunAsync(string code, string compiler, string input, CancellationToken cancellationToken)
    {
        Uri uri = new($"{_onlineCompilerOptions.Url.TrimEnd('/')}/api/run-code-sync/");
        OnlineCompilerRunRequest requestBody = new()
        {
            Input = input,
            Code = code,
            Compiler = compiler
        };
        using HttpRequestMessage request = new(HttpMethod.Post, uri);
        request.Headers.Add("Authorization", _onlineCompilerOptions.ApiKey);
        request.Content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");
        try
        {
            using HttpResponseMessage response = await _httpClient.SendAsync(request, cancellationToken);
            string content = await response.Content.ReadAsStringAsync(cancellationToken);
            response.EnsureSuccessStatusCode();
            RunCodeResponse result = JsonConvert.DeserializeObject<RunCodeResponse>(content) ?? new RunCodeResponse();
            return result;
        }
        catch (HttpRequestException ex)
        {
            throw new BusinessException($"HTTP error when calling OnlineCompiler API: {ex.Message}", ex);
        }
        catch (JsonException ex)
        {
            throw new BusinessException($"JSON parse error when reading OnlineCompiler response: {ex.Message}", ex);
        }
    }

    public async Task<IEnumerable<CompilerInfo>> GetCompilersAsync(CancellationToken cancellationToken)
    {
        Uri uri = new($"{_onlineCompilerOptions.Url.TrimEnd('/')}/api/compilers/");
        try
        {
            using HttpResponseMessage response = await _httpClient.GetAsync(uri, cancellationToken);
            response.EnsureSuccessStatusCode();
            string content = await response.Content.ReadAsStringAsync(cancellationToken);
            OnlineCompilerResponse onlineCompilerResponse = JsonConvert.DeserializeObject<OnlineCompilerResponse>(content) ?? new OnlineCompilerResponse();
            return onlineCompilerResponse.Compilers;
        }
        catch (HttpRequestException ex)
        {
            throw new BusinessException($"HTTP error when calling OnlineCompiler API: {ex.Message}", ex);
        }
        catch (JsonException ex)
        {
            throw new BusinessException($"JSON parse error when reading OnlineCompiler response: {ex.Message}", ex);
        }
    }
}