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

namespace CourseMate.Application.Commands.Courses;

public class CreateChapterCommand : IRequest<ResultIdDto>
{
    public Guid CourseId { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Title { get; set; } = string.Empty;

    [Range(0, int.MaxValue)]
    public int Position { get; set; }
}

internal sealed class CreateChapterCommandHandler : AbstractCommandHandler<CreateChapterCommand, ResultIdDto>
{
    public CreateChapterCommandHandler(CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(CreateChapterCommand request, CancellationToken cancellationToken)
    {
        Guid userId = CurrentUserId;
        bool isExistedCourse = await DbContext.Courses
            .WhereIf(IsInRole(Roles.Instructor), i => i.InstructorId == userId)
            .AnyAsync(i => i.Id == request.CourseId, cancellationToken);
        if (!isExistedCourse)
        {
            throw new UnauthorizedAccessException();
        }


        if (request.Position != 0)
        {
            bool isDuplicate = await DbContext.Chapters.AnyAsync(x => x.CourseId == request.CourseId && x.Position == request.Position, cancellationToken);
            if (isDuplicate)
            {
                throw new BusinessException(ErrorMessages.DuplicatePosition);
            }
        }

        int nextPosition = await DbContext.Chapters
            .Where(x => x.CourseId == request.CourseId)
            .Select(x => x.Position)
            .MaxAsync(cancellationToken);
        nextPosition++;
        if (request.Position > nextPosition)
        {
            throw new BusinessException(string.Format(ErrorMessages.PositionOutOfRange, nextPosition));
        }

        Chapter chapter = new(
            Guid.NewGuid(),
            request.CourseId,
            request.Title,
            request.Position
        );

        await DbContext.AddAsync(chapter, cancellationToken);
        return new ResultIdDto { Id = chapter.Id };
    }
}