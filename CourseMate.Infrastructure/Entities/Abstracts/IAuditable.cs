namespace CourseMate.Core.Entities.Abstracts;

public interface IAuditable
{
    Guid? UserId { get; set; }
    DateTimeOffset CreationTime { get; set; }
    DateTimeOffset? LastModificationTime { get; set; }
}