using CourseMate.Application.Shared;
using CourseMate.Contracts.DTOs.Commons;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Courses;

internal sealed class UpdateLessonProgressCommandHandler : AbstractCommandHandler<UpdateLessonProgressCommand, ResultIdDto>
{
    public UpdateLessonProgressCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor) 
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<ResultIdDto> Handle(UpdateLessonProgressCommand request, CancellationToken ct)
    {
        Guid studentId = CurrentUserId;

        UserLessonProgress? progress = await DbContext.UserLessonProgresses
            .FirstOrDefaultAsync(p => p.StudentId == studentId && p.LessonId == request.LessonId, ct);

        if (progress == null)
        {
            progress = new UserLessonProgress(
                Guid.NewGuid(),
                studentId,
                request.LessonId,
                request.IsCompleted,
                request.Score
            );
            await DbContext.UserLessonProgresses.AddAsync(progress, ct);
        }
        else
        {
            // Only update if not completed, or if score is better
            if (!progress.IsCompleted)
            {
                progress.IsCompleted = request.IsCompleted;
            }
            
            if (request.Score > progress.Score)
            {
                progress.Score = request.Score;
            }
        }

        await DbContext.SaveChangesAsync(ct);

        return new ResultIdDto { Id = progress.Id };
    }
}
