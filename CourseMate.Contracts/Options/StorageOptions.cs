namespace CourseMate.Contracts.Options;

public class StorageOptions
{
    /// <summary>
    ///     Root folder path to store uploaded files
    /// </summary>
    public string RootPath { get; set; } = string.Empty;

    /// <summary>
    ///     Static files request path, e.g. /coursemate-files
    /// </summary>
    public string StaticRequestPath { get; set; } = string.Empty;

    /// <summary>
    ///     Maximum size of each upload chunk in MB
    /// </summary>
    public int MaxChunkSizeMb { get; set; }

    /// <summary>
    ///     Maximum video file size in MB
    /// </summary>
    public int MaxVideoFileSizeMb { get; set; }

    /// <summary>
    ///     Default maximum file size in MB
    /// </summary>
    public int DefaultMaxFileSizeMb { get; set; }

    /// <summary>
    ///     Public static files folder
    /// </summary>
    public string PublicPath => Path.Combine(RootPath, "public");

    /// <summary>
    ///     Temporary upload folder
    /// </summary>
    public string TempPath => Path.Combine(RootPath, "temp");
}