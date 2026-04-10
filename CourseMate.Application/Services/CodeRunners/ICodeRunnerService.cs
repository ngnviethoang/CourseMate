namespace CourseMate.Application.Services.CodeRunners;

public interface ICodeRunnerService
{
    Task<string> RunAsync(string code, string language, CancellationToken cancellationToken);
}