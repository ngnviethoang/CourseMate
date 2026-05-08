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
    ///     Maximum image file size in MB
    /// </summary>
    public int MaxImageFileSizeMb { get; set; }

    /// <summary>
    ///     Maximum document file size in MB
    /// </summary>
    public int MaxDocumentFileSizeMb { get; set; }

    /// <summary>
    ///     Public static files folder
    /// </summary>
    public string PublicPath => Path.Combine(RootPath, "public");

    /// <summary>
    ///     Private protected files folder
    /// </summary>
    public string PrivatePath => Path.Combine(RootPath, "private");

    /// <summary>
    ///     Temporary upload folder
    /// </summary>
    public string TempPath => Path.Combine(RootPath, "temp");
}