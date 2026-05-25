using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Shared;
using CourseMate.Contracts;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Courses;

public class CreateOrUpdateLessonVideoCommand : IRequest<Unit>
{
    public Guid LessonId { get; set; }

    [MaxLength(CourseMateConsts.DefaultMaxLength)]
    public string VideoUrl { get; set; } = string.Empty;
}

internal sealed class CreateOrUpdateLessonVideoCommandHandler : AbstractCommandHandler<CreateOrUpdateLessonVideoCommand, Unit>
{
    public CreateOrUpdateLessonVideoCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<Unit> Handle(CreateOrUpdateLessonVideoCommand request, CancellationToken ct)
    {
        await EnsureAuthorCourseAsync(request.LessonId, ct);
        LessonVideo? existing = await DbContext.LessonVideos.FirstOrDefaultAsync(v => v.LessonId == request.LessonId, ct);
        if (existing is null)
        {
            await DbContext.LessonVideos.AddAsync(new LessonVideo(Guid.NewGuid(), request.LessonId, request.VideoUrl), ct);
        }
        else
        {
            existing.VideoUrl = request.VideoUrl;
        }

        return Unit.Value;
    }
}