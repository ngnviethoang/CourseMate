using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;

namespace CourseMate.Application.Services.CodeRunnerServices;

public interface ICodeRunnerService
{
    Task<RunCodeResponse> RunAsync(string code, string compiler, string input, CancellationToken ct);

    Task<IEnumerable<CompilerInfo>> GetCompilersAsync(CancellationToken ct);
}