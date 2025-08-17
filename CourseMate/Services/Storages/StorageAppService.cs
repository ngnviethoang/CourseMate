using CourseMate.BlobContainers;
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

    [Authorize(CourseMatePermissions.Files.Create)]
    public async Task<FileDto> UploadVideoAsync(IRemoteStreamContent streamContent)
    {
        IBlobContainer videoContainer = _blobContainerFactory.Create<VideoContainer>();
        Stream fs = streamContent.GetStream();
        Guid fileId = GuidGenerator.Create();
        string extension = Path.GetExtension(streamContent.FileName) ?? string.Empty;
        string fileName = $"{fileId}{extension}";
        await videoContainer.SaveAsync(fileName, fs);
        return new FileDto
        {
            Name = fileName,
            Size = streamContent.ContentLength.GetValueOrDefault()
        };
    }

    [Authorize(CourseMatePermissions.Files.Create)]
    public async Task<FileDto> UploadImageAsync(IRemoteStreamContent streamContent)
    {
        IBlobContainer imageContainer = _blobContainerFactory.Create<ImageContainer>();
        Stream fs = streamContent.GetStream();
        Guid fileId = GuidGenerator.Create();
        string extension = Path.GetExtension(streamContent.FileName) ?? string.Empty;
        string fileName = $"{fileId}{extension}";
        await imageContainer.SaveAsync(fileName, fs);
        return new FileDto
        {
            Name = fileName,
            Size = streamContent.ContentLength.GetValueOrDefault()
        };
    }

    [AllowAnonymous]
    public async Task<IRemoteStreamContent> GetImageAsync(string fileName)
    {
        IBlobContainer imageContainer = _blobContainerFactory.Create<ImageContainer>();
        Stream fs = await imageContainer.GetAsync(fileName);
        return new RemoteStreamContent(fs, contentType: "image/jpg");
    }

    [Authorize(CourseMatePermissions.Files.Delete)]
    public async Task DeleteAsync(string fileName)
    {
        IBlobContainer imageContainer = _blobContainerFactory.Create<ImageContainer>();
        IBlobContainer videoContainer = _blobContainerFactory.Create<VideoContainer>();
        await imageContainer.DeleteAsync(fileName);
        await videoContainer.DeleteAsync(fileName);
    }
}