namespace CourseMate.Infrastructure.Entities.Abstracts;

public interface ISoftDelete
{
    bool IsDeleted { get; set; }
}