namespace CourseMate.Contracts.Options;

public class StorageOptions
{
    /// <summary>
    ///     Folder path to store uploaded files
    /// </summary>
    public string Path { get; set; } = string.Empty;

    /// <summary>
    ///     Maximum size of each upload chunk in MB
    /// </summary>
    public int MaxSizeTrunkFile { get; set; }

    /// <summary>
    ///     Maximum video file size in MB
    /// </summary>
    public int MaxSizeFileVideo { get; set; }

    /// <summary>
    ///     Maximum image file size in MB
    /// </summary>
    public int MaxSizeFileImage { get; set; }

    /// <summary>
    ///     Maximum document file size in MB
    /// </summary>
    public int MaxSizeFileDocument { get; set; }

    public string TempPath => System.IO.Path.Combine(Path, "temp");

    public string VideosPath => System.IO.Path.Combine(Path, "videos");

    public string ImagesPath => System.IO.Path.Combine(Path, "images");

    public string DocumentsPath => System.IO.Path.Combine(Path, "documents");
}