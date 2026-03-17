using MediatR;

namespace CourseMate.Contract.DTOs.Admins;

public class GetUserByIdQuery : IRequest<UserDto?>
{
    public GetUserByIdQuery(Guid id)
    {
        Id = id;
    }

    public Guid Id { get; set; }
}