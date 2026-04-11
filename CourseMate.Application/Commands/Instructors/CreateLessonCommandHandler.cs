using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Shared;
using CourseMate.Contracts;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Instructors;

public class CreateLessonCommand : IRequest<ResultIdDto>
{
    public Guid ChapterId { get; set; }

    public Guid CourseId { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Title { get; set; } = string.Empty;

    public LessonType LessonType { get; set; }

    public int Position { get; set; }
}

internal sealed class CreateLessonCommandHandler : AbstractCommandHandler<CreateLessonCommand, ResultIdDto>
{
    public CreateLessonCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(CreateLessonCommand request, CancellationToken cancellationToken)
    {
        Guid instructorId = GetCurrentUserId();
        bool isOwnerCourse = await DbContext.Courses.AnyAsync(course => course.Id == request.CourseId && course.InstructorId == instructorId, cancellationToken);
        if (!isOwnerCourse)
        {
            throw new UnauthorizedAccessException();
        }

        bool isExistChapter = await DbContext.Chapters.AnyAsync(x => x.Id == request.ChapterId && x.CourseId == request.CourseId, cancellationToken);
        if (!isExistChapter)
        {
            throw new EntityNotFoundException(nameof(Chapter), request.ChapterId);
        }

        Lesson lesson = new(
            Guid.NewGuid(),
            request.ChapterId,
            request.CourseId,
            request.Title,
            request.LessonType,
            request.Position
        );

        await DbContext.AddAsync(lesson, cancellationToken);
        return new ResultIdDto { Id = lesson.Id };
    }
}