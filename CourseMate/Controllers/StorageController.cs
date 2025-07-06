using CourseMate.BlobContainers;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.BlobStoring;

namespace CourseMate.Controllers;

[Route("api/app/storage")]
[ApiController]
public class StorageController : AbpController
{
    private readonly IBlobContainerFactory _blobContainerFactory;

    public StorageController(IBlobContainerFactory blobContainerFactory)
    {
        _blobContainerFactory = blobContainerFactory;
    }

    [HttpGet("video")]
    [Obsolete("Disabled in Swagger UI.")]
    public async Task<FileStreamResult> GetVideo([FromQuery] string fileName)
    {
        IBlobContainer videoContainer = _blobContainerFactory.Create<VideoContainer>();
        Stream fs = await videoContainer.GetAsync(fileName);
        return File(fs, contentType: "video/mp4", enableRangeProcessing: true);
    }
}