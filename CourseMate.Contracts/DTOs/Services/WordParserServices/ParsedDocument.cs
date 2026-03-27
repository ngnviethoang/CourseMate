namespace CourseMate.Contracts.DTOs.Services.WordParserServices;

public class ParsedDocument
{
    public string Title { get; set; } = string.Empty;
    public List<ParsedSection> Sections { get; set; } = [];
}