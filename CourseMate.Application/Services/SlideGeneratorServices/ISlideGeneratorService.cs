using CourseMate.Contracts.DTOs.Instructors;

namespace CourseMate.Application.Services.SlideGeneratorServices;

public interface ISlideGeneratorService
{
    /// <summary>
    ///     Generate a PowerPoint (.pptx) file from slide content sections
    /// </summary>
    Task GenerateAsync(string title, List<OutlineSectionDto> sections, string outputPath, CancellationToken cancellationToken = default);
}