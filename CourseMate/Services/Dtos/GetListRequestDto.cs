using System.ComponentModel.DataAnnotations;

namespace CourseMate.Services.Dtos;

public class GetListRequestDto
{
    [MaxLength(1024)]
    public string? Sorting { get; set; }

    [Range(0, int.MaxValue)]
    public int? SkipCount { get; set; }

    [Range(0, 1000)]
    public int? MaxResultCount { get; set; }
}