namespace CourseMate.Persistent.Entities.Abstracts;

public interface IMayHaveUser
{
    Guid? UserId { get; set; }
}