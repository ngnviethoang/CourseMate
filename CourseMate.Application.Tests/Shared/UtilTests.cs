using CourseMate.Application.Shared;

namespace CourseMate.Application.Tests.Shared;

public class UtilTests
{
    [Fact]
    public void NormalizeRelativePath_ShouldReturnForwardSlashRelativePath()
    {
        string rootPath = Path.Combine("C:", "storage");
        string physicalPath = Path.Combine("C:", "storage", "user-1", "video.mp4");

        string result = Util.NormalizeRelativePath(rootPath, physicalPath);

        Assert.Equal("user-1/video.mp4", result);
    }

    [Fact]
    public void NormalizeRelativePath_ShouldThrowArgumentException_WhenRootPathMissing()
    {
        Assert.Throws<ArgumentException>(() => Util.NormalizeRelativePath(string.Empty, "C:\\storage\\file.txt"));
    }

    [Fact]
    public void NormalizeRelativePath_ShouldReturnEmptyString_WhenPhysicalPathMissing()
    {
        string result = Util.NormalizeRelativePath("C:\\storage", string.Empty);

        Assert.Equal(string.Empty, result);
    }
}