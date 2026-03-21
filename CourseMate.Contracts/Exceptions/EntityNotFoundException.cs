using CourseMate.Contracts.Constants;

namespace CourseMate.Contracts.Exceptions;

public class EntityNotFoundException : Exception
{
    public EntityNotFoundException(string entity, Guid id) : base(string.Format(ExceptionMessages.EntityNotFound, entity, id))
    {
    }
}