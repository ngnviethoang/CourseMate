using CourseMate.Persistent.Entities.Abstracts;
using Microsoft.AspNetCore.Identity;

namespace CourseMate.Persistent.Entities;

public class User : IdentityUser<Guid>, IAuditable, ISoftDelete
{
    public User(string userName) : base(userName)
    {
    }

    public User()
    {
    }

    public override Guid Id { get; set; }

    public bool IsApproved { get; set; } = true;

    public DateTimeOffset CreationTime { get; set; }

    public DateTimeOffset? LastModificationTime { get; set; }

    public bool IsDeleted { get; set; }
}