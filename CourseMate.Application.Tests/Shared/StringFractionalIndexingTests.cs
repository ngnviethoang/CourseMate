using CourseMate.Contracts.Shared;

namespace CourseMate.Application.Tests.Shared;

public class StringFractionalIndexingTests
{
    [Fact]
    public void GenerateKeyBetween_ShouldMatchExpectedExamples()
    {
        string first = StringFractionalIndexing.GenerateKeyBetween(null, null);
        Assert.Equal("a0", first);

        string second = StringFractionalIndexing.GenerateKeyBetween(first, null);
        Assert.Equal("a1", second);

        string third = StringFractionalIndexing.GenerateKeyBetween(second, null);
        Assert.Equal("a2", third);

        string zeroth = StringFractionalIndexing.GenerateKeyBetween(null, first);
        Assert.Equal("Zz", zeroth);

        string secondAndHalf = StringFractionalIndexing.GenerateKeyBetween(second, third);
        Assert.Equal("a1V", secondAndHalf);
    }

    [Fact]
    public void GenerateNKeysBetween_ShouldMatchExpectedExamples()
    {
        IReadOnlyList<string> first = StringFractionalIndexing.GenerateNKeysBetween(null, null, 2);
        Assert.Equal(["a0", "a1"], first);

        IReadOnlyList<string> afterSecond = StringFractionalIndexing.GenerateNKeysBetween(first[1], null, 2);
        Assert.Equal(["a2", "a3"], afterSecond);

        IReadOnlyList<string> beforeFirst = StringFractionalIndexing.GenerateNKeysBetween(null, first[0], 2);
        Assert.Equal(["Zy", "Zz"], beforeFirst);

        IReadOnlyList<string> betweenFirstAndSecond = StringFractionalIndexing.GenerateNKeysBetween(first[0], first[1], 2);
        Assert.Equal(["a0G", "a0V"], betweenFirstAndSecond);
    }
}