namespace CourseMate.Persistent.Entities.Abstracts;

public interface IAuditable
{
    DateTimeOffset CreationTime { get; set; }
    DateTimeOffset? LastModificationTime { get; set; }
}