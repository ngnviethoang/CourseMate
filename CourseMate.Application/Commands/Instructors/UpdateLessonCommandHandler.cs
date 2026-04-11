using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Shared;
using CourseMate.Contracts;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Enums;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Instructors;

public class UpdateLessonCommand : IRequest<int>
{
    public Guid Id { get; set; }

    public Guid ChapterId { get; set; }

    public Guid CourseId { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string Title { get; set; } = string.Empty;

    public LessonType LessonType { get; set; }

    public int Position { get; set; }
}

internal sealed class UpdateLessonCommandHandler : AbstractCommandHandler<UpdateLessonCommand, int>
{
    public UpdateLessonCommandHandler(
        CourseMateDbContext dbContext,
        IHttpContextAccessor httpContextAccessor) : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(UpdateLessonCommand request, CancellationToken cancellationToken)
    {
        Guid instructorId = GetCurrentUserId();
        bool isOwnerCourse = await DbContext.Courses.AnyAsync(course => course.Id == request.CourseId && course.InstructorId == instructorId, cancellationToken);
        if (!isOwnerCourse)
        {
            throw new UnauthorizedAccessException();
        }

        Lesson? lesson = await DbContext.Lessons.FirstOrDefaultAsync(x => x.Id == request.Id &&
                                                                          x.ChapterId == request.ChapterId &&
                                                                          x.CourseId == request.CourseId, cancellationToken);
        if (lesson == null)
        {
            throw new EntityNotFoundException(nameof(Lesson), request.Id);
        }

        lesson.ChapterId = request.ChapterId;
        lesson.CourseId = request.CourseId;
        lesson.Title = request.Title;
        lesson.LessonType = request.LessonType;
        lesson.Position = request.Position;

        DbContext.Update(lesson);
        return Codes.Success;
    }
}