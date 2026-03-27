namespace CourseMate.Contracts.Options;

public class AiOptions
{
    /// <summary>
    ///     Google Gemini API key
    /// </summary>
    public string ApiKey { get; set; } = string.Empty;

    /// <summary>
    ///     Model name, e.g. "gemini-2.0-flash"
    /// </summary>
    public string Model { get; set; } = string.Empty;

    /// <summary>
    ///     Maximum output tokens for AI responses
    /// </summary>
    public int MaxOutputTokens { get; set; }
}