using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.DTOs;
using CourseMate.Contracts.Enums;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Queries.Courses;

public class GetLessonOutlineStatusQuery : IRequest<LessonOutlineStatusDto>
{
    public Guid LessonId { get; set; }
}

public sealed class GetLessonOutlineStatusQueryHandler : AbstractQueryHandler<GetLessonOutlineStatusQuery, LessonOutlineStatusDto>
{
    public GetLessonOutlineStatusQueryHandler(CourseMateReadOnlyDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<LessonOutlineStatusDto> Handle(GetLessonOutlineStatusQuery request, CancellationToken ct)
    {
        if (IsInRole(Roles.Instructor))
        {
            bool isAuthor = await (
                    from lesson in DbContext.Lessons
                    join course in DbContext.Courses
                        on lesson.CourseId equals course.Id
                    where lesson.Id == request.LessonId
                    where course.InstructorId == CurrentUserId
                    select course.InstructorId
                )
                .AnyAsync(ct);
            if (!isAuthor)
            {
                throw new UnauthorizedAccessException();
            }
        }

        LessonMaterial? lessonMaterial = await DbContext.LessonMaterials
            .Where(l => l.LessonId == request.LessonId)
            .OrderByDescending(l => l.CreationTime)
            .FirstOrDefaultAsync(ct);

        if (lessonMaterial == null)
        {
            return new LessonOutlineStatusDto
            {
                LessonId = request.LessonId,
                IsReady = false
            };
        }

        bool hasOutline = !string.IsNullOrWhiteSpace(lessonMaterial.Outline);
        return new LessonOutlineStatusDto
        {
            LessonId = request.LessonId,
            LessonMaterialId = lessonMaterial.Id,
            Status = lessonMaterial.Status,
            IsReady = lessonMaterial.Status == LessonMaterialState.Completed && hasOutline
        };
    }
}
