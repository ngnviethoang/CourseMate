using CourseMate.Services.Dtos.Chapters;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace CourseMate.Services.Chapters;

public interface IChapterAppService : ICrudAppService<ChapterDto, Guid, PagedAndSortedResultRequestDto, CreateUpdateChapterDto>;