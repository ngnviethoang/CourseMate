namespace CourseMate.Persistent.Entities.Abstracts;

public interface ISoftDelete
{
    bool IsDeleted { get; set; }
}