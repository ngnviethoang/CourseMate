using CourseMate.Contracts.DTOs.Services.WordParserServices;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.Extensions.Logging;

namespace CourseMate.Application.Services.WordParserServices;

public class WordParserService : IWordParserService
{
    private readonly ILogger<WordParserService> _logger;

    public WordParserService(ILogger<WordParserService> logger)
    {
        _logger = logger;
    }

    public Task<ParsedDocument> ParseAsync(string filePath, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Parsing Word document: {FilePath}", filePath);

        using WordprocessingDocument doc = WordprocessingDocument.Open(filePath, false);
        Body? body = doc.MainDocumentPart?.Document?.Body;
        if (body is null)
        {
            throw new InvalidOperationException("Word document has no body content.");
        }

        ParsedDocument result = new();
        ParsedSection? currentSection = null;

        foreach (OpenXmlElement element in body.Elements())
        {
            if (element is Paragraph paragraph)
            {
                ProcessParagraph(paragraph, result, ref currentSection);
            }
            else if (element is Table table)
            {
                currentSection ??= CreateDefaultSection(result);
                ProcessTable(table, currentSection);
            }
        }

        _logger.LogInformation("Parsed {SectionCount} sections from document", result.Sections.Count);
        return Task.FromResult(result);
    }

    private void ProcessParagraph(Paragraph paragraph, ParsedDocument document, ref ParsedSection? currentSection)
    {
        string text = paragraph.InnerText?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(text))
        {
            return;
        }

        string? styleId = paragraph.ParagraphProperties?.ParagraphStyleId?.Val?.Value;

        // Check if it's a heading
        if (IsHeading(styleId))
        {
            if (IsTitle(styleId) && string.IsNullOrEmpty(document.Title))
            {
                document.Title = text;
                return;
            }

            currentSection = new ParsedSection { Heading = text };
            document.Sections.Add(currentSection);
            return;
        }

        // Check if it's a list item
        if (paragraph.ParagraphProperties?.NumberingProperties is not null)
        {
            currentSection ??= CreateDefaultSection(document);
            currentSection.ListItems.Add(text);
            return;
        }

        // Regular paragraph
        currentSection ??= CreateDefaultSection(document);
        currentSection.Paragraphs.Add(text);
    }

    private void ProcessTable(Table table, ParsedSection section)
    {
        ParsedTable parsedTable = new();
        foreach (TableRow row in table.Elements<TableRow>())
        {
            List<string> cells = row.Elements<TableCell>()
                .Select(cell => cell.InnerText?.Trim() ?? string.Empty)
                .ToList();
            parsedTable.Rows.Add(cells);
        }

        if (parsedTable.Rows.Count > 0)
        {
            section.Tables.Add(parsedTable);
        }
    }

    private static bool IsHeading(string? styleId)
    {
        if (string.IsNullOrEmpty(styleId))
        {
            return false;
        }

        return styleId.StartsWith("Heading", StringComparison.OrdinalIgnoreCase)
               || styleId.StartsWith("heading", StringComparison.OrdinalIgnoreCase)
               || styleId.Equals("Title", StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsTitle(string? styleId)
    {
        return styleId?.Equals("Title", StringComparison.OrdinalIgnoreCase) == true
               || styleId?.Equals("Heading1", StringComparison.OrdinalIgnoreCase) == true;
    }

    private static ParsedSection CreateDefaultSection(ParsedDocument document)
    {
        ParsedSection section = new() { Heading = "Content" };
        document.Sections.Add(section);
        return section;
    }
}