using System.ComponentModel.DataAnnotations;

namespace CourseMate.Services.Dtos.Lookups;

public class LookupRequestDto
{
    [Range(0, int.MaxValue)]
    public int? SkipCount { get; set; }

    [Range(0, 1000)]
    public int? MaxResultCount { get; set; }

    public string? Filter { get; set; }
}