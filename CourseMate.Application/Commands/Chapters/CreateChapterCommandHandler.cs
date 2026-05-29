using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Shared;
using CourseMate.Contracts;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Exceptions;
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

    [Range(0, int.MaxValue)]
    public int Position { get; set; }
}

public sealed class CreateChapterCommandHandler : AbstractCommandHandler<CreateChapterCommand, ResultIdDto>
{
    public CreateChapterCommandHandler(CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(CreateChapterCommand request, CancellationToken ct)
    {
        Guid userId = CurrentUserId;
        bool isExistedCourse = IsInRole(Roles.Admin) || await DbContext.Courses
            .WhereIf(IsInRole(Roles.Instructor), i => i.InstructorId == userId)
            .AnyAsync(i => i.Id == request.CourseId, ct);
        if (!isExistedCourse)
        {
            throw new UnauthorizedAccessException();
        }


        if (request.Position != 0)
        {
            bool isDuplicate = await DbContext.Chapters.AnyAsync(x => x.CourseId == request.CourseId && x.Position == request.Position, ct);
            if (isDuplicate)
            {
                throw new BusinessException(ErrorCode.DuplicatePosition, "Duplicate position.");
            }
        }

        int nextPosition = (await DbContext.Chapters
            .Where(x => x.CourseId == request.CourseId)
            .MaxAsync(x => (int?)x.Position, ct) ?? 0) + 1;

        int finalPosition = request.Position == 0 ? nextPosition : request.Position;

        if (finalPosition > nextPosition)
        {
            throw new BusinessException(ErrorCode.PositionOutOfRange, string.Format("Position must be 0 or equal to next position '{0}'.", nextPosition));
        }

        Chapter chapter = new(
            Guid.NewGuid(),
            request.CourseId,
            request.Title,
            finalPosition
        );

        await DbContext.AddAsync(chapter, ct);
        return new ResultIdDto { Id = chapter.Id };
    }
}