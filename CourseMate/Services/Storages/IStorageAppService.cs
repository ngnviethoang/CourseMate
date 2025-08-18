using CourseMate.Services.Dtos.Storages;
using Volo.Abp.Content;

namespace CourseMate.Services.Storages;

public interface IStorageAppService : IApplicationService
{
    Task<FileDto> UploadVideoAsync(IRemoteStreamContent streamContent);
    Task<FileDto> UploadImageAsync(IRemoteStreamContent streamContent);
    Task<IRemoteStreamContent> GetImageAsync(string fileName);
    Task DeleteImageAsync(string fileName);
    Task DeleteVideoAsync(string fileName);
}