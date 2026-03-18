using System.Security.Claims;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Students;
using CourseMate.Contracts.Exceptions;
using CourseMate.Infrastructure;
using CourseMate.Infrastructure.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Students;

internal sealed class DeleteOrderCommandHandler : IRequestHandler<DeleteOrderCommand>
{
    private readonly CourseMateDbContext _dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public DeleteOrderCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
    {
        _dbContext = dbContext;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task Handle(DeleteOrderCommand request, CancellationToken cancellationToken)
    {
        string? userIdString = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid studentId = Guid.TryParse(userIdString, out Guid parsedId) ? parsedId : Guid.Empty;

        Order? order = await _dbContext.Orders.FirstOrDefaultAsync(o => o.Id == request.Id && o.StudentId == studentId, cancellationToken);
        if (order == null)
        {
            throw new EntityNotFoundException(ExceptionMessages.EntityNotFound);
        }

        _dbContext.Orders.Remove(order);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}