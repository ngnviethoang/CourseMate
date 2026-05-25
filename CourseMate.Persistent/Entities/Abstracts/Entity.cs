using System.ComponentModel.DataAnnotations;

namespace CourseMate.Persistent.Entities.Abstracts;

public abstract class Entity : IAuditable, ISoftDelete, IMayHaveUser
{
    protected Entity(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }

    [Timestamp]
    public uint RowVersion { get; set; }

    public DateTimeOffset CreationTime { get; set; }

    public DateTimeOffset? LastModificationTime { get; set; }

    public Guid? UserId { get; set; }

    public bool IsDeleted { get; set; }
}