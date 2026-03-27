using CourseMate.Contracts.DTOs.Commons;
using MediatR;

namespace CourseMate.Contracts.DTOs.Students;

public class GetRecommendedCoursesQuery : IRequest<PagedDto<CourseDto>>
{
    public int PageIndex { get; set; } = 1;

    public int PageSize { get; set; } = 10;
}