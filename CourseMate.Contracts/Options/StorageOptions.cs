namespace CourseMate.Contracts.Options;

public class StorageOptions
{
    public string Path { get; set; } = string.Empty;

    public int MaxSizeTrunkFile { get; set; }

    public string TempPath => System.IO.Path.Combine(Path, "temp");

    public string VideosPath => System.IO.Path.Combine(Path, "videos");

    public string ImagesPath => System.IO.Path.Combine(Path, "images");
}