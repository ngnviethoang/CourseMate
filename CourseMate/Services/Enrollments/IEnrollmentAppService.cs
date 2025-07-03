using CourseMate.Services.Dtos.Enrollments;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace CourseMate.Services.Enrollments;

public interface IEnrollmentAppService : ICrudAppService<EnrollmentDto, Guid, PagedAndSortedResultRequestDto, CreateUpdateEnrollmentDto>;