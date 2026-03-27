namespace CourseMate.Contracts.DTOs.Services.WordParserServices;

public class ParsedSection
{
    public string Heading { get; set; } = string.Empty;
    public List<string> Paragraphs { get; set; } = [];
    public List<ParsedTable> Tables { get; set; } = [];
    public List<string> ListItems { get; set; } = [];
}