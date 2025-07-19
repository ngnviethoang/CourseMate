using CourseMate.Services.Dtos.Reviews;

namespace CourseMate.Services.Reviews;

public interface IReviewAppService : ICrudAppService<ReviewDto, Guid, PagedAndSortedResultRequestDto, CreateUpdateReviewDto>;