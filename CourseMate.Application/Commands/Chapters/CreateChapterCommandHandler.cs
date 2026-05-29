using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Shared;
using CourseMate.Contracts;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Exceptions;
using CourseMate.Contracts.Shared;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Chapters;

public class CreateChapterCommand : IRequest<ResultIdDto>
{
    public Guid CourseId { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    [Required]
    public string Title { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int SortOrder { get; set; }
}

public sealed class CreateChapterCommandHandler : AbstractCommandHandler<CreateChapterCommand, ResultIdDto>
{
    public CreateChapterCommandHandler(CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(CreateChapterCommand request, CancellationToken ct)
    {
        await DbContext.Courses.EnsureExistsAsync(request.CourseId, ct);
        Guid userId = CurrentUserId;
        bool isAdmin = IsInRole(Roles.Admin);
        bool canManageCourse = isAdmin || (IsInRole(Roles.Instructor) && await DbContext.Courses
            .AnyAsync(i => i.Id == request.CourseId && i.InstructorId == userId, ct));
        if (!canManageCourse)
        {
            throw new UnauthorizedAccessException();
        }

        List<string> siblingPositions = await DbContext.Chapters
            .Where(x => x.CourseId == request.CourseId)
            .OrderBy(x => x.Position)
            .Select(x => x.Position)
            .ToListAsync(ct);

        int maxAllowedSortOrder = siblingPositions.Count + 1;
        if (request.SortOrder < 1 || request.SortOrder > maxAllowedSortOrder)
        {
            throw new BusinessException(ErrorCode.PositionOutOfRange, $"SortOrder must be between 1 and '{maxAllowedSortOrder}'");
        }

        int insertIndex = request.SortOrder - 1;
        string? previous = insertIndex > 0 ? siblingPositions[insertIndex - 1] : null;
        string? next = insertIndex < siblingPositions.Count ? siblingPositions[insertIndex] : null;
        string position = StringFractionalIndexing.GenerateBetween(previous, next);

        Chapter chapter = new(Guid.NewGuid(), request.CourseId, request.Title, position);

        await DbContext.AddAsync(chapter, ct);
        return new ResultIdDto { Id = chapter.Id };
    }
}