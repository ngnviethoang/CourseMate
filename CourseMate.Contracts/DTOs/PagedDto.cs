namespace CourseMate.Contract.DTOs;

public class PagedDto<T> where T : class
{
    public int PageSize { get; set; }

    public int PageIndex { get; set; }

    public int TotalCount { get; set; }

    public IEnumerable<T> Items { get; set; } = new List<T>();
}