namespace CourseMate.Contracts.Exceptions;

public class EntityNotFoundException : Exception
{
    public EntityNotFoundException(string entity, Guid id) : base(string.Format("{0} with Id '{1}' was not found.", entity, id))
    {
    }

    public EntityNotFoundException()
    {
    }

    public EntityNotFoundException(string message) : base(message)
    {
    }

    public EntityNotFoundException(string message, Exception innerException) : base(message, innerException)
    {
    }
}