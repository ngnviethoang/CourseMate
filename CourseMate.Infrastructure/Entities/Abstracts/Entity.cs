namespace CourseMate.Core.Entities.Abstracts;

public abstract class Entity : IAuditable, ISoftDelete
{
    protected Entity(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }
    public Guid? UserId { get; set; }
    public DateTimeOffset CreationTime { get; set; }
    public DateTimeOffset? LastModificationTime { get; set; }
    public bool IsDeleted { get; set; }
}