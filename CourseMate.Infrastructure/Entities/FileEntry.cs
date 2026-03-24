using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Contracts.Enums;
using CourseMate.Infrastructure.Entities.Abstracts;

namespace CourseMate.Infrastructure.Entities;

public class FileEntry : Entity
{
    public FileEntry(Guid id, string fileName, string contentType, double fileSize, string filePath,
        string tempFilePath, FileStatus status, int totalChunks, int uploadedChunks,
        DateTimeOffset? completedAt, FileType fileType) : base(id)
    {
        FileName = fileName;
        ContentType = contentType;
        FileSize = fileSize;
        FilePath = filePath;
        TempFilePath = tempFilePath;
        Status = status;
        TotalChunks = totalChunks;
        UploadedChunks = uploadedChunks;
        CompletedAt = completedAt;
        FileType = fileType;
    }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string FileName { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string ContentType { get; set; }

    public double FileSize { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string FilePath { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string TempFilePath { get; set; }

    public FileStatus Status { get; set; }

    public int TotalChunks { get; set; }

    public int UploadedChunks { get; set; }

    public DateTimeOffset? CompletedAt { get; set; }

    public FileType FileType { get; set; }
}