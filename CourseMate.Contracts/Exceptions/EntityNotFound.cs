namespace CourseMate.Contract.Exceptions;

public class EntityNotFound : Exception
{
    public EntityNotFound()
    {
    }

    public EntityNotFound(string message) : base(message)
    {
    }

    public EntityNotFound(string message, Exception innerException) : base(message, innerException)
    {
    }
}