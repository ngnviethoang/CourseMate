using CourseMate.Contracts.DTOs.Admins;
using CourseMate.Infrastructure;

AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Admins;

internal sealed class GetUserByIdQueryHandler : AbstractQueryHandler<GetUserByIdQuery, UserDto?>
{
    public GetUserByIdQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<UserDto?> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        UserDto? user = await DbContext.Users
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