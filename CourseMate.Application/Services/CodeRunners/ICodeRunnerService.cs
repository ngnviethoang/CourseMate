using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.DTOs.Commons;

namespace CourseMate.Application.Services.CodeRunners;

public interface ICodeRunnerService
{
    Task<RunCodeResponse> RunAsync(string code, string compiler, string input, CancellationToken cancellationToken);
    Task<IEnumerable<CompilerInfo>> GetCompilersAsync(CancellationToken cancellationToken);
}