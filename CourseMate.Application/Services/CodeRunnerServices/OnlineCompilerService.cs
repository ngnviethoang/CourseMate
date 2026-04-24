using System.Text;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Exceptions;
using CourseMate.Contracts.Options;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace CourseMate.Application.Services.CodeRunnerServices;

public class OnlineCompilerService : ICodeRunnerService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<OnlineCompilerService> _logger;
    private readonly OnlineCompilerOptions _onlineCompilerOptions;

    public OnlineCompilerService(IOptions<OnlineCompilerOptions> options, HttpClient httpClient, ILogger<OnlineCompilerService> logger)
    {
        _onlineCompilerOptions = options.Value;
        _httpClient = httpClient;
        _logger = logger;
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
        string payload = JsonConvert.SerializeObject(requestBody);
        using HttpRequestMessage request = new(HttpMethod.Post, uri);
        request.Headers.Add("Authorization", _onlineCompilerOptions.ApiKey);
        request.Content = new StringContent(payload, Encoding.UTF8, "application/json");
        try
        {
            _logger.LogInformation("HTTP {Method} {Url} | Payload: {Payload}", request.Method, uri, payload);
            using HttpResponseMessage response = await _httpClient.SendAsync(request, cancellationToken);
            string content = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogInformation("HTTP {Method} {Url} | Status: {StatusCode} | Response: {Response}", request.Method, uri, (int)response.StatusCode, content);
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
            _logger.LogInformation("HTTP {Method} {Url}", HttpMethod.Get, uri);
            using HttpResponseMessage response = await _httpClient.GetAsync(uri, cancellationToken);
            response.EnsureSuccessStatusCode();
            string content = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogInformation("HTTP {Method} {Url} | Status: {StatusCode} | Response: {Response}", HttpMethod.Get, uri, (int)response.StatusCode, content);
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