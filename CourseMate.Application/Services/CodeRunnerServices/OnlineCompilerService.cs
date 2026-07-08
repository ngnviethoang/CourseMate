using System.Text;
using CourseMate.Contracts.Constants;
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

    public async Task<RunCodeResponse> RunAsync(string code, string compiler, string input, CancellationToken ct)
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
            _logger.LogInformation(
                "Calling OnlineCompiler run API. Method={Method}, Url={Url}, Compiler={Compiler}, CodeLength={CodeLength}, InputLength={InputLength}",
                request.Method,
                uri,
                compiler,
                code.Length,
                input.Length);
            using HttpResponseMessage response = await _httpClient.SendAsync(request, ct);
            string content = await response.Content.ReadAsStringAsync(ct);
            _logger.LogInformation(
                "OnlineCompiler run API completed. Method={Method}, Url={Url}, StatusCode={StatusCode}, ResponseLength={ResponseLength}",
                request.Method,
                uri,
                (int)response.StatusCode,
                content.Length);
            response.EnsureSuccessStatusCode();
            RunCodeResponse result = JsonConvert.DeserializeObject<RunCodeResponse>(content) ?? new RunCodeResponse();
            _logger.LogInformation(
                "OnlineCompiler run result parsed. Compiler={Compiler}, Status={Status}, ExitCode={ExitCode}, OutputLength={OutputLength}, ErrorLength={ErrorLength}",
                compiler,
                result.Status,
                result.ExitCode,
                result.Output?.Length ?? 0,
                result.Error?.Length ?? 0);
            return result;
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "OnlineCompiler run API failed. Method={Method}, Url={Url}, Compiler={Compiler}", request.Method, uri, compiler);
            throw new BusinessException(ErrorCode.Unknown, $"HTTP error when calling OnlineCompiler API: {ex.Message}", ex);
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "OnlineCompiler run response parse failed. Url={Url}, Compiler={Compiler}", uri, compiler);
            throw new BusinessException(ErrorCode.Unknown, $"JSON parse error when reading OnlineCompiler response: {ex.Message}", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "OnlineCompiler run failed unexpectedly. Url={Url}, Compiler={Compiler}", uri, compiler);
            throw new BusinessException(ErrorCode.Unknown, $"Unexpected error when calling OnlineCompiler API: {ex.Message}", ex);
        }
    }

    public async Task<IEnumerable<CompilerInfo>> GetCompilersAsync(CancellationToken ct)
    {
        Uri uri = new($"{_onlineCompilerOptions.Url.TrimEnd('/')}/api/compilers/");
        try
        {
            _logger.LogInformation("Calling OnlineCompiler compilers API. Method={Method}, Url={Url}", HttpMethod.Get, uri);
            using HttpResponseMessage response = await _httpClient.GetAsync(uri, ct);
            string content = await response.Content.ReadAsStringAsync(ct);
            _logger.LogInformation(
                "OnlineCompiler compilers API completed. Method={Method}, Url={Url}, StatusCode={StatusCode}, ResponseLength={ResponseLength}",
                HttpMethod.Get,
                uri,
                (int)response.StatusCode,
                content.Length);
            response.EnsureSuccessStatusCode();
            OnlineCompilerResponse onlineCompilerResponse = JsonConvert.DeserializeObject<OnlineCompilerResponse>(content) ?? new OnlineCompilerResponse();
            _logger.LogInformation("OnlineCompiler compilers parsed. CompilerCount={CompilerCount}", onlineCompilerResponse.Compilers?.Count() ?? 0);
            return onlineCompilerResponse.Compilers ?? [];
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "OnlineCompiler compilers API failed. Url={Url}", uri);
            throw new BusinessException(ErrorCode.Unknown, $"HTTP error when calling OnlineCompiler API: {ex.Message}", ex);
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "OnlineCompiler compilers response parse failed. Url={Url}", uri);
            throw new BusinessException(ErrorCode.Unknown, $"JSON parse error when reading OnlineCompiler response: {ex.Message}", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "OnlineCompiler compilers request failed unexpectedly. Url={Url}", uri);
            throw new BusinessException(ErrorCode.Unknown, $"Unexpected error when calling OnlineCompiler API: {ex.Message}", ex);
        }
    }
}