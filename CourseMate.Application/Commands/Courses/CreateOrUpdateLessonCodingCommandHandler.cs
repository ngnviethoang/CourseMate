using CourseMate.Application.Shared;
using CourseMate.Contracts.Constants;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Courses;

public class CreateOrUpdateLessonCodingCommand : IRequest<int>
{
    public Guid LessonId { get; set; }

    public Guid ExerciseId { get; set; }
}

internal sealed class CreateOrUpdateLessonCodingCommandHandler : AbstractCommandHandler<CreateOrUpdateLessonCodingCommand, int>
{
    public CreateOrUpdateLessonCodingCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<int> Handle(CreateOrUpdateLessonCodingCommand request, CancellationToken ct)
    {
        await EnsureAuthorCourseAsync(request.LessonId, ct);
        bool exerciseExists = await DbContext.Exercises.AnyAsync(e => e.Id == request.ExerciseId, ct);
        if (!exerciseExists)
        {
            throw new EntityNotFoundException(nameof(Exercise), request.ExerciseId);
        }

        LessonCoding? existing = await DbContext.LessonCodings.FirstOrDefaultAsync(c => c.LessonId == request.LessonId, ct);
        if (existing is null)
        {
            await DbContext.LessonCodings.AddAsync(new LessonCoding(Guid.NewGuid(), request.LessonId, request.ExerciseId), ct);
        }
        else
        {
            existing.ExerciseId = request.ExerciseId;
        }

        await DbContext.SaveChangesAsync(ct);
        return Codes.Success;
    }
}