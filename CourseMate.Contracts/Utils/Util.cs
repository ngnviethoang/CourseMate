namespace CourseMate.Contracts.Utils;

public class Util
{
    public static string CreateDirectoryIfNotExist(string path)
    {
        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }

        return path;
    }
}