using System.ComponentModel.DataAnnotations;
using MediatR;

namespace CourseMate.Contracts.DTOs.Commons;

public abstract class GetListQuery<T> : IRequest<PagedDto<T>> where T : class
{
    [MaxLength(1024)]
    public string? Sorting { get; set; }

    [Range(1, 25)]
    public int PageSize { get; set; } = 10;

    [Range(1, int.MaxValue)]
    public int PageIndex { get; set; } = 1;

    [MaxLength(100)]
    public string? Filter { get; set; }

    public DateTime? From { get; set; }

    public DateTime? To { get; set; }
}