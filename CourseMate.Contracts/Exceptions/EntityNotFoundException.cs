using CourseMate.Contracts.Constants;

namespace CourseMate.Contracts.Exceptions;

public class EntityNotFoundException : Exception
{
    public EntityNotFoundException(string entity, Guid id) : base(string.Format(ErrorMessages.EntityNotFound, entity, id))
    {
    }
}