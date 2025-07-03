using CourseMate.Services.Dtos.Reviews;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace CourseMate.Services.Reviews;

public interface IReviewAppService : ICrudAppService<ReviewDto, Guid, PagedAndSortedResultRequestDto, CreateUpdateReviewDto>;