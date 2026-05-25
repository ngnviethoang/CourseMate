using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs;
using CourseMate.Persistent;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Users;

public class GetUserByIdQuery : IRequest<UserDto?>
{
    public Guid Id { get; set; }
}

internal sealed class GetUserByIdQueryHandler : AbstractQueryHandler<GetUserByIdQuery, UserDto?>
{
    public GetUserByIdQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<UserDto?> Handle(GetUserByIdQuery request, CancellationToken ct)
    {
        UserDto? user = await DbContext.Users
            .Where(x => x.Id == request.Id)
            .Select(x => new UserDto
            {
                Id = x.Id,
                UserName = x.UserName,
                Email = x.Email,
                PhoneNumber = x.PhoneNumber,
                CreationTime = x.CreationTime,
                LastModificationTime = x.LastModificationTime
            })
            .FirstOrDefaultAsync(ct);

        return user;
    }
}