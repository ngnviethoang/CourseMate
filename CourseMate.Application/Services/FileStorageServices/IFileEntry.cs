namespace CourseMate.Application.Services.FileStorageServices;

public interface IFileEntry
{
    Guid Id { get; set; }

    string FileName { get; set; }

    string FileLocation { get; set; }
}