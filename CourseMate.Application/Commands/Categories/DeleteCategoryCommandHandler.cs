using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Categories;

public class DeleteCategoryCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}

public sealed class DeleteCategoryAbstractCommandHandler : AbstractCommandHandler<DeleteCategoryCommand, Unit>
{
    public DeleteCategoryAbstractCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<Unit> Handle(DeleteCategoryCommand request, CancellationToken ct)
    {
        bool hasCourseUsingCategory = await DbContext.Courses.AnyAsync(x => x.CategoryId == request.Id, ct);
        if (hasCourseUsingCategory)
        {
            throw new BusinessException(ErrorCode.CategoryHasCourses, "Category is being used by one or more courses.");
        }

        await DbContext.Categories.RemoveByIdAsync(request.Id, ct);
        return Unit.Value;
    }
}