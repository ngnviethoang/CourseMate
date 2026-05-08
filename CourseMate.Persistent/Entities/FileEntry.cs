using System.ComponentModel.DataAnnotations;
using CourseMate.Contracts;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent.Entities.Abstracts;

namespace CourseMate.Persistent.Entities;

public class FileEntry : Entity
{
    public FileEntry(Guid id, string fileName, double fileSize, string fileLocation, FileStatus status, int totalChunks, int uploadedChunks,
        DateTimeOffset? completedAt, FileType fileType) : base(id)
    {
        FileName = fileName;
        FileSize = fileSize;
        FileLocation = fileLocation;
        Status = status;
        TotalChunks = totalChunks;
        UploadedChunks = uploadedChunks;
        CompletedAt = completedAt;
        FileType = fileType;
    }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string FileName { get; set; }

    public double FileSize { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string FileLocation { get; set; }

    public FileStatus Status { get; set; }

    public int TotalChunks { get; set; }

    public int UploadedChunks { get; set; }

    public DateTimeOffset? CompletedAt { get; set; }

    public FileType FileType { get; set; }
}