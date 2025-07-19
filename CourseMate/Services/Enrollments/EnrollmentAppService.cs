using CourseMate.Entities.Enrollments;
using CourseMate.Permissions;
using CourseMate.Services.Dtos.Enrollments;
using Microsoft.AspNetCore.Authorization;

namespace CourseMate.Services.Enrollments;

[Authorize(CourseMatePermissions.Enrollments.Default)]
public class EnrollmentAppService : CourseMateAppService, IEnrollmentAppService
{
    public async Task<EnrollmentDto> GetAsync(Guid id)
    {
        Enrollment chapter = await EnrollmentRepo.GetAsync(id);
        return ObjectMapper.Map<Enrollment, EnrollmentDto>(chapter);
    }

    public async Task<PagedResultDto<EnrollmentDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        IQueryable<Enrollment> queryable = await EnrollmentRepo.GetQueryableAsync();
        IQueryable<Enrollment> query = queryable
            .OrderBy(input.Sorting.IsNullOrWhiteSpace() ? "Name" : input.Sorting)
            .Skip(input.SkipCount)
            .Take(input.MaxResultCount);

        List<Enrollment> enrollments = await AsyncExecuter.ToListAsync(query);
        int totalCount = await AsyncExecuter.CountAsync(queryable);

        return new PagedResultDto<EnrollmentDto>(totalCount, ObjectMapper.Map<List<Enrollment>, List<EnrollmentDto>>(enrollments)
        );
    }

    [Authorize(CourseMatePermissions.Enrollments.Create)]
    public async Task<EnrollmentDto> CreateAsync(CreateUpdateEnrollmentDto input)
    {
        Enrollment enrollment = ObjectMapper.Map<CreateUpdateEnrollmentDto, Enrollment>(input);
        await EnrollmentRepo.InsertAsync(enrollment);
        return ObjectMapper.Map<Enrollment, EnrollmentDto>(enrollment);
    }

    [Authorize(CourseMatePermissions.Enrollments.Edit)]
    public async Task<EnrollmentDto> UpdateAsync(Guid id, CreateUpdateEnrollmentDto input)
    {
        Enrollment enrollment = await EnrollmentRepo.GetAsync(id);
        ObjectMapper.Map(input, enrollment);
        await EnrollmentRepo.UpdateAsync(enrollment);
        return ObjectMapper.Map<Enrollment, EnrollmentDto>(enrollment);
    }

    [Authorize(CourseMatePermissions.Enrollments.Delete)]
    public async Task DeleteAsync(Guid id)
    {
        await EnrollmentRepo.DeleteAsync(id);
    }
}