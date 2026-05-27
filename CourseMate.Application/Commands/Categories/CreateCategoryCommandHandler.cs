using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Shared;
using CourseMate.Contracts;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace CourseMate.Application.Commands.Categories;

public class CreateCategoryCommand : IRequest<ResultIdDto>
{
    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    [Required]
    public string Name { get; set; } = string.Empty;

    [MaxLength(CourseMateConsts.DescriptionMaxLength)]
    [Required]
    public string Description { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}

public sealed class CreateCategoryCommandHandler : AbstractCommandHandler<CreateCategoryCommand, ResultIdDto>
{
    public CreateCategoryCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(CreateCategoryCommand request, CancellationToken ct)
    {
        Category category = new(Guid.NewGuid(), request.Name, request.Description, request.IsActive);
        await DbContext.AddAsync(category, ct);
        return new ResultIdDto { Id = category.Id };
    }
}