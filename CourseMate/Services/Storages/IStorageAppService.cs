using CourseMate.Services.Dtos.Storages;
using Volo.Abp.Application.Services;
using Volo.Abp.Content;

namespace CourseMate.Services.Storages;

public interface IStorageAppService : IApplicationService
{
    Task<FileDto> UploadVideoAsync(IRemoteStreamContent streamContent);
    Task<IRemoteStreamContent> DownloadVideoAsync(Guid fileId);
    Task<FileDto> SaveBytesAsync(byte[] bytes);
    Task<byte[]?> GetBytesAsync(Guid fileId);
    Task DeleteAsync(Guid fileId);
}