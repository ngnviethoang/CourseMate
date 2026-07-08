using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Shared;
using CourseMate.Contracts;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Lessons;

public class CreateOrUpdateLessonReadingCommand : IRequest<Unit>
{
    public Guid LessonId { get; set; }

    [MaxLength(CourseMateConsts.ContentMaxLength)]
    public string Content { get; set; } = string.Empty;
}

public sealed class CreateOrUpdateLessonReadingCommandHandler : AbstractCommandHandler<CreateOrUpdateLessonReadingCommand, Unit>
{
    public CreateOrUpdateLessonReadingCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<Unit> Handle(CreateOrUpdateLessonReadingCommand request, CancellationToken ct)
    {
        await EnsureAuthorCourseAsync(request.LessonId, ct);
        LessonReading? existing = await DbContext.LessonReadings.FirstOrDefaultAsync(r => r.LessonId == request.LessonId, ct);
        if (existing is null)
        {
            await DbContext.LessonReadings.AddAsync(new LessonReading(Guid.NewGuid(), request.LessonId, request.Content), ct);
        }
        else
        {
            existing.Content = request.Content;
        }

        return Unit.Value;
    }
}