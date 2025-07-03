using CourseMate.Permissions;
using CourseMate.Services.Dtos.Storages;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.BlobStoring;
using Volo.Abp.Content;

namespace CourseMate.Services.Storages;

[Authorize(CourseMatePermissions.Files.Default)]
public class StorageAppService : CourseMateAppService, IStorageAppService
{
    private readonly IBlobContainerFactory _blobContainerFactory;

    public StorageAppService(IBlobContainerFactory blobContainerFactory)
    {
        _blobContainerFactory = blobContainerFactory;
    }

    public Task<FileDto> UploadVideoAsync(IRemoteStreamContent streamContent)
    {
        throw new NotImplementedException();
    }

    public Task<IRemoteStreamContent> DownloadVideoAsync(Guid fileId)
    {
        throw new NotImplementedException();
    }

    public Task<FileDto> SaveBytesAsync(byte[] bytes)
    {
        throw new NotImplementedException();
    }

    public Task<byte[]?> GetBytesAsync(Guid fileId)
    {
        throw new NotImplementedException();
    }

    public Task DeleteAsync(Guid fileId)
    {
        throw new NotImplementedException();
    }
}