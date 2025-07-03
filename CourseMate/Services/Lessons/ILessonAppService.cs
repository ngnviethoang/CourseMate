using CourseMate.Services.Dtos.Chapters;
using CourseMate.Services.Dtos.Lessons;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace CourseMate.Services.Lessons;

public interface ILessonAppService : ICrudAppService<LessonDto, Guid, PagedAndSortedResultRequestDto, CreateUpdateChapterDto>;