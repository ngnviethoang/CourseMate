using CourseMate.Contracts.DTOs.Services.WordParserServices;

namespace CourseMate.Application.Services.WordParserServices;

public interface IWordParserService
{
    /// <summary>
    ///     Parse a Word document (.docx) from a file path and return structured content
    /// </summary>
    Task<ParsedDocument> ParseAsync(string filePath, CancellationToken cancellationToken = default);
}