using CourseMate.Services.Dtos;
using CourseMate.Services.Dtos.Chapters;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace CourseMate.Services.Chapters;

public interface IChapterAppService : IApplicationService
{
    Task<ChapterDto> GetAsync(Guid id);
    Task<PagedResultDto<ChapterDto>> GetListAsync(GetListRequestDto input);
    Task<ResultObjectDto> CreateAsync(CreateUpdateChapterDto input);
    Task<ChapterDto> UpdateAsync(Guid id, CreateUpdateChapterDto input);
    Task DeleteAsync(Guid id);
}