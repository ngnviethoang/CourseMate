using CourseMate.Services.Dtos.Enrollments;

namespace CourseMate.Services.Enrollments;

public interface IEnrollmentAppService : ICrudAppService<EnrollmentDto, Guid, PagedAndSortedResultRequestDto, CreateUpdateEnrollmentDto>;