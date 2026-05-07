using System.ComponentModel.DataAnnotations;
using CourseMate.Application.Shared;
using CourseMate.Contracts;
using CourseMate.Contracts.Constants;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Courses;

public class CreateOrUpdateLessonReadingCommand : IRequest<int>
{
    public Guid LessonId { get; set; }

    [MaxLength(CourseMateConsts.ContentMaxLength)]
    public string Content { get; set; } = string.Empty;
}

internal sealed class CreateOrUpdateLessonReadingCommandHandler : AbstractCommandHandler<CreateOrUpdateLessonReadingCommand, int>
{
    public CreateOrUpdateLessonReadingCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(CreateOrUpdateLessonReadingCommand request, CancellationToken ct)
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

        await DbContext.SaveChangesAsync(ct);
        return Codes.Success;
    }
}