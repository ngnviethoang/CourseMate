using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Shared;
using CourseMate.Contracts;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using CourseMate.Persistent.ExtensionMethods;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Courses;

public class CreateLessonCommand : IRequest<ResultIdDto>
{
    public Guid ChapterId { get; set; }

    public Guid CourseId { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Title { get; set; } = string.Empty;

    public LessonType LessonType { get; set; }

    [Range(0, int.MaxValue)]
    public int Position { get; set; }
}

internal sealed class CreateLessonCommandHandler : AbstractCommandHandler<CreateLessonCommand, ResultIdDto>
{
    public CreateLessonCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(CreateLessonCommand request, CancellationToken ct)
    {
        Guid userId = CurrentUserId;
        bool isOwnerCourse = await DbContext.Courses
            .WhereIf(IsInRole(Roles.Instructor), x => x.InstructorId == userId)
            .AnyAsync(course => course.Id == request.CourseId, ct);
        if (!isOwnerCourse)
        {
            throw new UnauthorizedAccessException();
        }

        bool isExistChapter = await DbContext.Chapters.AnyAsync(x => x.Id == request.ChapterId && x.CourseId == request.CourseId, ct);
        if (!isExistChapter)
        {
            throw new EntityNotFoundException(nameof(Chapter), request.ChapterId);
        }

        if (request.Position != 0)
        {
            bool isDuplicate = await DbContext.Lessons.AnyAsync(x => x.ChapterId == request.ChapterId && x.Position == request.Position, ct);
            if (isDuplicate)
            {
                throw new BusinessException(ErrorMessages.DuplicatePosition);
            }
        }

        int nextPosition = (await DbContext.Lessons
            .Where(x => x.ChapterId == request.ChapterId)
            .MaxAsync(x => (int?)x.Position, ct) ?? 0) + 1;

        int finalPosition = request.Position == 0 ? nextPosition : request.Position;

        if (finalPosition > nextPosition)
        {
            throw new BusinessException(string.Format(ErrorMessages.PositionOutOfRange, nextPosition));
        }

        Lesson lesson = new(
            Guid.NewGuid(),
            request.ChapterId,
            request.CourseId,
            request.Title,
            request.LessonType,
            finalPosition
        );

        await DbContext.AddAsync(lesson, ct);
        return new ResultIdDto { Id = lesson.Id };
    }
}