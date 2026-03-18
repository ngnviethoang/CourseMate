using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Admins;

internal sealed class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, UserDto?>
{
    private readonly CourseMateReadOnlyDbContext _dbContext;

    public GetUserByIdQueryHandler(CourseMateReadOnlyDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<UserDto?> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        UserDto? user = await _dbContext.Users
            .Where(x => x.Id == request.Id)
            .Select(x => new UserDto
            {
                Id = x.Id,
                UserName = x.UserName,
                Email = x.Email,
                PhoneNumber = x.PhoneNumber
            })
            .FirstOrDefaultAsync(cancellationToken);

        return user;
    }
}