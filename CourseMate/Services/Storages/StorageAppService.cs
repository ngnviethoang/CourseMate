using CourseMate.BlobContainers;
using CourseMate.Permissions;
using CourseMate.Services.Dtos.Storages;
using CourseMate.Settings;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.BlobStoring;
using Volo.Abp.Content;
using Volo.Abp.Settings;

namespace CourseMate.Services.Storages;

[Authorize(CourseMatePermissions.Files.Default)]
public class StorageAppService : CourseMateAppService, IStorageAppService
{
    private readonly IBlobContainerFactory _blobContainerFactory;
    private readonly ISettingProvider _settingProvider;

    public StorageAppService(IBlobContainerFactory blobContainerFactory, ISettingProvider settingProvider)
    {
        _blobContainerFactory = blobContainerFactory;
        _settingProvider = settingProvider;
    }

    [Authorize(CourseMatePermissions.Files.Create)]
    public async Task<FileDto> UploadVideoAsync(IRemoteStreamContent streamContent)
    {
        await FileRequestValidate(streamContent);
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
        await FileRequestValidate(streamContent);
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
    public async Task DeleteImageAsync(string fileName)
    {
        IBlobContainer imageContainer = _blobContainerFactory.Create<ImageContainer>();
        await imageContainer.DeleteAsync(fileName);
    }

    [Authorize(CourseMatePermissions.Files.Delete)]
    public async Task DeleteVideoAsync(string fileName)
    {
        IBlobContainer videoContainer = _blobContainerFactory.Create<VideoContainer>();
        await videoContainer.DeleteAsync(fileName);
    }

    private async Task FileRequestValidate(IRemoteStreamContent streamContent)
    {
        await ValidateExtension(streamContent);
        await ValidateContentTypeAndSize(streamContent);
    }

    private async Task ValidateExtension(IRemoteStreamContent streamContent)
    {
        string? allowFileExtension = await _settingProvider.GetOrNullAsync(StorageSettings.AllowFileExtension);
        if (allowFileExtension.IsNullOrWhiteSpace())
        {
            throw new UserFriendlyException("No allowed file extension is configured.");
        }

        List<string> allowedExtensions = allowFileExtension
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(x => x.ToLower())
            .ToList();

        string? fileExtension = Path.GetExtension(streamContent.FileName)?.TrimStart('.').ToLower();
        if (fileExtension.IsNullOrWhiteSpace() || !allowedExtensions.Contains(fileExtension))
        {
            throw new UserFriendlyException($"File extension '{fileExtension}' is not allowed.");
        }
    }

    private async Task ValidateContentTypeAndSize(IRemoteStreamContent streamContent)
    {
        string contentType = streamContent.ContentType.ToLower();
        if (contentType.IsNullOrWhiteSpace())
        {
            throw new UserFriendlyException("File ContentType is missing.");
        }

        long fileSize = streamContent.ContentLength.GetValueOrDefault();

        if (contentType.StartsWith("image/"))
        {
            long maxSize = await _settingProvider.GetAsync<long>(StorageSettings.ImageMaxSize);
            EnsureFileSize(fileSize, maxSize, "image");
        }
        else if (contentType.StartsWith("video/"))
        {
            long maxSize = await _settingProvider.GetAsync<long>(StorageSettings.VideoMaxSize);
            EnsureFileSize(fileSize, maxSize, "video");
        }
        else
        {
            throw new UserFriendlyException("Unsupported file type.");
        }
    }

    private void EnsureFileSize(long fileSize, long maxSize, string fileType)
    {
        if (fileSize > maxSize)
        {
            throw new UserFriendlyException($"{fileType} size exceeds the limit ({maxSize} bytes).");
        }
    }
}