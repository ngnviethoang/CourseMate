namespace CourseMate.Contracts.Options;

public class CorsOptions
{
    public bool AllowAnyOrigin { get; set; }

    public string[] AllowedOrigins { get; set; } = [];
}