namespace CourseMate.Core.Entities.Abstracts;

public interface ISoftDelete
{
    bool IsDeleted { get; set; }
}