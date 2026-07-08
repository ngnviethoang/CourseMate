using CourseMate.Application.Shared;
using CourseMate.Contracts.Exceptions;
using CourseMate.Persistent;
using CourseMate.Persistent.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CourseMate.Application.Commands.Reviews;

public class ReviewCourseCommand : IRequest<Guid>
{
    public Guid CourseId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
}

public sealed class ReviewCourseCommandHandler : AbstractCommandHandler<ReviewCourseCommand, Guid>
{
    public ReviewCourseCommandHandler(CourseMateDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        : base(dbContext, httpContextAccessor)
    {
    }

    public override async Task<Guid> Handle(ReviewCourseCommand request, CancellationToken ct)
    {
        if (request.Rating < 1 || request.Rating > 5)
        {
            throw new ArgumentException("Rating must be between 1 and 5.");
        }

        Guid studentId = CurrentUserId;

        // Ensure user is enrolled in the course
        await EnsureEnrollmentAsync(request.CourseId);

        // Ensure course exists
        Course? course = await DbContext.Courses.FirstOrDefaultAsync(c => c.Id == request.CourseId, ct);
        if (course == null)
        {
            throw new EntityNotFoundException(nameof(Course), request.CourseId);
        }

        Review? existingReview = await DbContext.Reviews
            .FirstOrDefaultAsync(r => r.CourseId == request.CourseId && r.StudentId == studentId, ct);

        if (existingReview != null)
        {
            // Update existing review
            existingReview.Rating = request.Rating;
            existingReview.Comment = request.Comment;
            await DbContext.SaveChangesAsync(ct);
            return existingReview.Id;
        }

        // Create new review
        Review newReview = new(Guid.NewGuid(), request.CourseId, studentId, request.Rating, request.Comment);
        DbContext.Reviews.Add(newReview);
        await DbContext.SaveChangesAsync(ct);

        return newReview.Id;
    }
}