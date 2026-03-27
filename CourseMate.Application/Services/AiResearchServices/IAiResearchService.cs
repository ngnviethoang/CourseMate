using CourseMate.Contracts.DTOs.Instructors;

namespace CourseMate.Application.Services.AiResearchServices;

public interface IAiResearchService
{
    /// <summary>
    ///     Generate a lesson outline from parsed document content
    /// </summary>
    Task<List<OutlineSectionDto>> GenerateOutlineAsync(string parsedContentJson, CancellationToken cancellationToken = default);

    /// <summary>
    ///     Generate detailed slide content from an approved outline (returns enhanced outline with speaker notes)
    /// </summary>
    Task<List<OutlineSectionDto>> GenerateSlideContentAsync(string outlineJson, CancellationToken cancellationToken = default);
}