namespace CourseMate.Contracts.Options;

public class AppSettings
{
    public CorsOptions Cors { get; set; } = new();
    public GoogleAiOptions GoogleAi { get; set; } = new();
    public OllamaOptions Ollama { get; set; } = new();
    public OnlineCompilerOptions OnlineCompiler { get; set; } = new();
    public PayOsOptions PayOs { get; set; } = new();
    public StorageOptions Storage { get; set; } = new();
}